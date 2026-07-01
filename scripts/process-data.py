"""
Data preprocessing script for APS Demo - East Steel.
Reads client Excel files and outputs JSON for the Next.js frontend.

Usage (from work dir c:/Users/shaoy/Desktop/麦肯锡/东北特钢):
    uv run python scripts/process-data.py
"""
import sys
import json
import math
import random
from pathlib import Path
from datetime import datetime, timedelta

import pandas as pd

# ---- paths ----------------------------------------------------------------
WORK_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = WORK_DIR / "Client Data"
OUT_DIR  = WORK_DIR / "aps-demo" / "src" / "data"

def out(subdir: str, filename: str) -> Path:
    p = OUT_DIR / subdir
    p.mkdir(parents=True, exist_ok=True)
    return p / filename

def save(path: Path, data) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  wrote {path.relative_to(WORK_DIR)}  ({len(data) if isinstance(data, list) else '1 obj'})")

# ---- helper ---------------------------------------------------------------
def safe_float(v, default=0.0) -> float:
    try:
        return float(v) if v is not None and not (isinstance(v, float) and math.isnan(v)) else default
    except Exception:
        return default

def safe_str(v, default="") -> str:
    if v is None or (isinstance(v, float) and math.isnan(v)):
        return default
    return str(v).strip()

# ===========================================================================
# 1. global/global-kpi.json
#    GlobalKpi: {label, value, direction, unit}
# ===========================================================================
def build_global_kpi() -> None:
    """Extract 4 headline KPIs from the monthly production indicator table."""
    path = DATA_DIR / "生产管理处--2026年5月份主要指标表.xlsx"
    df = pd.read_excel(path, sheet_name="主要指标表模板",
                       header=None, engine="openpyxl")

    # Col layout (0-indexed): 0=指标, 6=年度保证目标, 8=月计划, 9=同期(last year), 10=上月
    # Rows that we care about (0-indexed from raw):
    #   row 5  -> 钢产量       plan=row[8], actual=row[9]
    #   row 28 -> 大型材轧机   row[8] plan, row[9] actual
    #   row 39 -> 商品入库总量 row[8] plan, row[9] actual
    #   row 49 -> 连铸比       row[8] plan, row[9] actual

    def get_row(label_contains: str):
        for i, row in df.iterrows():
            cell = safe_str(row[0])
            if label_contains in cell:
                return row
        return None

    steel_row  = get_row("3.钢产量")
    bigmill    = get_row("大型材轧机")
    inbound    = get_row("10.商品入库")
    cont_cast  = get_row("20.连铸比")

    def kpi(label: str, row, plan_col=8, actual_col=9, unit="吨", direction="up", fmt=".0f"):
        plan   = safe_float(row[plan_col]) if row is not None else 0
        actual = safe_float(row[actual_col]) if row is not None else 0
        value  = format(actual, fmt) if fmt != "pct" else f"{actual:.2f}%"
        return {"label": label, "value": str(value), "direction": direction, "unit": unit}

    data = [
        kpi("5月钢产量",         steel_row,  8, 9,  "吨",   "up"),
        kpi("大型材月产量",       bigmill,    8, 9,  "吨",   "up"),
        kpi("商品入库量",         inbound,    8, 9,  "吨",   "up"),
        {"label": "连铸比",
         "value": f"{safe_float(cont_cast[9] if cont_cast is not None else 88.9):.1f}",
         "direction": "up",
         "unit": "%"},
    ]
    save(out("global", "global-kpi.json"), data)

# ===========================================================================
# 2. scene1/orders-sample.json
#    Order: {orderId, contractId, steelGrade, steelCategory, productLine,
#            equipment, plannedTons, shape, thickness, width, length,
#            deliveryState, plannedMonth, isOverdue}
# ===========================================================================
PRODUCT_LINE_MAP = {
    "小棒": "小型材", "大棒": "大型材", "高线": "线材",
    "模具钢": "模具钢", "锻钢": "锻钢", "钢丝": "钢丝",
    "银亮": "银亮材", "精密": "精密", "炼钢": "商品锭坯",
    "特冶": "特冶", "双高线": "线材",
}

def build_orders_sample() -> None:
    path = DATA_DIR / "5月排产合同.xlsx"
    df = pd.read_excel(path, sheet_name="Sheet", engine="openpyxl")

    # Sample proportionally across product lines: min(30, total) per line, up to 300 total
    groups = []
    for line_code, group_df in df.groupby("产线代码"):
        sample_n = min(30, len(group_df))
        groups.append(group_df.head(sample_n))
    sampled = pd.concat(groups).reset_index(drop=True)
    # Trim to 300 if needed
    sampled = sampled.head(300).reset_index(drop=True)

    def is_overdue(delivery_str) -> bool:
        try:
            d = pd.to_datetime(delivery_str)
            return d < pd.Timestamp("2026-05-31")
        except Exception:
            return False

    def assign_priority(i: int) -> str:
        r = i % 5
        if r == 0:
            return "high"
        elif r in (2, 3):
            return "low"
        else:
            return "medium"

    records = []
    for i, row in sampled.iterrows():
        delivery = safe_str(row.get("交期时间", ""))
        planned_month = safe_str(row.get("排产年月", "2026年5月"))
        # Map product line
        line_code = safe_str(row.get("产线代码", ""))
        product_line = PRODUCT_LINE_MAP.get(line_code, line_code or "其他")

        records.append({
            "orderId":      safe_str(row.get("订单号", f"ORD{i:05d}")),
            "contractId":   safe_str(row.get("合同号", "")),
            "steelGrade":   safe_str(row.get("钢种", "")),
            "steelCategory":safe_str(row.get("钢类", "")),
            "productLine":  product_line,
            "equipment":    safe_str(row.get("设备", "")),
            "plannedTons":  safe_float(row.get("订单重量", 0)),
            "shape":        safe_str(row.get("形状", "")),
            "thickness":    safe_float(row.get("厚度", 0)),
            "width":        safe_float(row.get("宽度", 0)),
            "length":       safe_float(row.get("长度", 0)),
            "deliveryState":safe_str(row.get("交货状态", "热轧")),
            "plannedMonth": planned_month,
            "isOverdue":    is_overdue(delivery),
            "priority":     assign_priority(i),
        })
    save(out("scene1", "orders-sample.json"), records)

# ===========================================================================
# 3. scene1/order-groups.json
#    OrderGroup: {groupId, steelGrade, orderCount, totalTons,
#                 earliestDelivery, grossProfitPerTon, capacityUsage, status}
# ===========================================================================
def build_order_groups() -> None:
    path = DATA_DIR / "5月排产合同.xlsx"
    df = pd.read_excel(path, sheet_name="Sheet", engine="openpyxl")

    grouped = df.groupby("钢种").agg(
        orderCount=("订单号", "count"),
        totalTons=("订单重量", lambda x: pd.to_numeric(x, errors="coerce").sum()),
        earliestDelivery=("交期时间", "min"),
    ).reset_index().rename(columns={"钢种": "steelGrade"})

    # Sort by totalTons descending, take top 30
    grouped = grouped.nlargest(30, "totalTons").reset_index(drop=True)

    rng = random.Random(42)
    records = []
    for i, row in grouped.iterrows():
        status = "optimal" if row["totalTons"] > 50 else "feasible"
        records.append({
            "groupId":        f"GRP{i+1:03d}",
            "steelGrade":     safe_str(row["steelGrade"]),
            "orderCount":     int(row["orderCount"]),
            "totalTons":      round(safe_float(row["totalTons"]), 3),
            "earliestDelivery": safe_str(row["earliestDelivery"])[:10],
            "grossProfitPerTon": round(rng.uniform(300, 800), 1),
            "capacityUsage":  f"{rng.randint(60, 95)}%",
            "status":         status,
        })
    save(out("scene1", "order-groups.json"), records)

# ===========================================================================
# 4. scene2/gantt-schedule.json
#    GanttTask: {id, batchId, line, equipment, steelGrade, standard, spec,
#                startTime, endTime, constraint, stage}
# ===========================================================================
STAGE_MAP = {
    "连铸机": "casting", "连铸": "casting",
    "加热炉": "heating",
    "轧机": "rolling", "1050": "rolling", "750": "rolling",
    "模具": "rolling",  "锻造": "rolling",
    "精整": "finishing",
}

def infer_stage(machine_name: str) -> str:
    m = safe_str(machine_name)
    for k, v in STAGE_MAP.items():
        if k in m:
            return v
    return "casting"

def build_gantt() -> None:
    """
    Build ~180 Gantt tasks from the 3 west-zone files + 3 east-zone files (Jun 21-23).
    Each row in Sheet1 = one furnace/casting task.
    We synthesize heating, rolling, finishing tasks with reasonable offsets.
    """
    west_files = [
        "6月21日炼钢厂西区72小时作业计划.xlsx",
        "6月22日炼钢厂西区72小时作业计划.xlsx",
        "6月23日炼钢厂西区72小时作业计划.xlsx",
    ]
    east_files = [
        "炼钢厂东区72小时作业计划6-21.xlsx",
        "炼钢厂东区72小时作业计划6-22.xlsx",
        "炼钢厂东区72小时作业计划6-23.xlsx",
    ]

    BASE_START = datetime(2026, 6, 21, 8, 0)
    records = []
    task_id = 1
    batch_id = 1

    def parse_rows(filepath: Path, zone: str):
        nonlocal task_id, batch_id
        try:
            df = pd.read_excel(filepath, sheet_name="Sheet1",
                               header=None, engine="openpyxl")
        except Exception:
            return

        # First row = title, second row = header
        current_date_block = 0  # which 24-h window we're in

        for i in range(2, len(df)):
            row = df.iloc[i]
            # Detect date blocks from col0
            cell0 = safe_str(row[0])
            if "6月" in cell0 and "班" in cell0:
                current_date_block += 1
                continue
            # Skip notes row
            if "说明" in cell0:
                continue

            # Col layout:  [date, shift, machine, steel_grade, standard, spec/ingot, fixed_len, count, notes, dest]
            machine    = safe_str(row[2] if zone == "west" else row[2])
            steel      = safe_str(row[3])
            standard   = safe_str(row[4])
            spec       = safe_str(row[5])
            count_str  = safe_str(row[7] if zone == "west" else row[7])

            if not steel or steel == "nan":
                continue

            # Estimate number of furnaces
            try:
                n_furnaces = int("".join(c for c in count_str if c.isdigit()) or "1")
            except Exception:
                n_furnaces = 1
            n_furnaces = min(max(n_furnaces, 1), 8)

            # Casting task: ~90 min per furnace
            cast_start = BASE_START + timedelta(
                hours=current_date_block * 8 + task_id * 0.5
            )
            cast_dur = timedelta(minutes=90 * n_furnaces)
            cast_end = cast_start + cast_dur

            equipment  = machine if machine else (f"3#连铸机" if zone == "west" else "连铸")
            line       = "炼钢西区" if zone == "west" else "炼钢东区"

            bid = f"B{batch_id:04d}"

            records.append({
                "id": f"T{task_id:04d}", "batchId": bid,
                "line": line, "equipment": equipment,
                "steelGrade": steel, "standard": standard, "spec": spec,
                "startTime": cast_start.isoformat(),
                "endTime": cast_end.isoformat(),
                "constraint": "normal",
                "stage": "casting",
            })
            task_id += 1

            # Heating: starts 30 min after cast ends, ~120 min
            heat_start = cast_end + timedelta(minutes=30)
            heat_end   = heat_start + timedelta(minutes=120)
            records.append({
                "id": f"T{task_id:04d}", "batchId": bid,
                "line": line, "equipment": "加热炉",
                "steelGrade": steel, "standard": standard, "spec": spec,
                "startTime": heat_start.isoformat(),
                "endTime": heat_end.isoformat(),
                "constraint": "normal",
                "stage": "heating",
            })
            task_id += 1

            # Rolling: starts 15 min after heat ends, ~60 min
            roll_start = heat_end + timedelta(minutes=15)
            roll_end   = roll_start + timedelta(minutes=60)
            roll_equip = "1050轧机" if zone == "west" else "高线轧机"
            records.append({
                "id": f"T{task_id:04d}", "batchId": bid,
                "line": line, "equipment": roll_equip,
                "steelGrade": steel, "standard": standard, "spec": spec,
                "startTime": roll_start.isoformat(),
                "endTime": roll_end.isoformat(),
                "constraint": "normal",
                "stage": "rolling",
            })
            task_id += 1

            # Finishing: starts right after rolling, ~45 min
            fin_start = roll_end
            fin_end   = fin_start + timedelta(minutes=45)
            records.append({
                "id": f"T{task_id:04d}", "batchId": bid,
                "line": line, "equipment": "精整",
                "steelGrade": steel, "standard": standard, "spec": spec,
                "startTime": fin_start.isoformat(),
                "endTime": fin_end.isoformat(),
                "constraint": "normal",
                "stage": "finishing",
            })
            task_id += 1
            batch_id += 1

            if len(records) >= 180:
                return

    for f in west_files:
        parse_rows(DATA_DIR / f, "west")
        if len(records) >= 180:
            break
    if len(records) < 180:
        for f in east_files:
            parse_rows(DATA_DIR / f, "east")
            if len(records) >= 180:
                break

    # Filter out placeholder rows where key fields contain Chinese placeholder text
    PLACEHOLDERS = {"钢种", "标准", "规格", "品种"}
    filtered = [
        r for r in records
        if safe_str(r.get("steelGrade")) not in PLACEHOLDERS
        and safe_str(r.get("spec")) not in PLACEHOLDERS
        and safe_str(r.get("standard")) not in PLACEHOLDERS
    ]

    save(out("scene2", "gantt-schedule.json"), filtered[:200])

# ===========================================================================
# 5. scene2/furnace-model.json
#    FurnaceModelData: {heatPrediction, loadingGroups, rhythmMatch, improvements}
# ===========================================================================
def build_furnace_model() -> None:
    rng = random.Random(7)
    BASE = datetime(2026, 6, 21, 0, 0)

    # heatPrediction: 24 hourly points
    heat_pred = []
    temp = 1180.0
    for h in range(24):
        t = (BASE + timedelta(hours=h)).strftime("%H:%M")
        noise = rng.gauss(0, 8)
        actual = round(temp + noise, 1)
        predicted = round(temp + rng.gauss(0, 3), 1)
        heat_pred.append({"time": t, "predicted": predicted, "actual": actual})
        temp += rng.uniform(-5, 5)

    # loadingGroups: 8 steel grade groups with deltaT
    steel_grades = [
        ("GCr15A", "#e74c3c"),
        ("42CrMo", "#3498db"),
        ("H13", "#2ecc71"),
        ("30CrMoA", "#f39c12"),
        ("40Cr", "#9b59b6"),
        ("Cr12MoV", "#1abc9c"),
        ("GCr15SiMn", "#e67e22"),
        ("4Cr13", "#34495e"),
    ]
    loading_groups = []
    for i, (sg, color) in enumerate(steel_grades):
        loading_groups.append({
            "groupId": f"LG{i+1:02d}",
            "steelGrade": sg,
            "deltaT": round(rng.uniform(-30, 30), 1),
            "color": color,
        })

    # rhythmMatch: 24 points
    rhythm_match = []
    for h in range(24):
        t = (BASE + timedelta(hours=h)).strftime("%H:%M")
        furnace_output = round(rng.uniform(40, 65), 1)
        mill_demand    = round(rng.uniform(38, 62), 1)
        rhythm_match.append({
            "time": t,
            "furnaceOutput": furnace_output,
            "millDemand": mill_demand,
        })

    # improvements: 4 metrics from spec targets
    improvements = [
        {"label": "轧线等炉时间", "before": 45,  "after": 22,  "unit": "min", "improvement": "-51%"},
        {"label": "OEE",        "before": 72,  "after": 78,  "unit": "%",   "improvement": "+8.3%"},
        {"label": "能耗",        "before": 3.2, "after": 2.95,"unit": "GJ/t","improvement": "-7.8%"},
        {"label": "热装热送率",   "before": 52,  "after": 67,  "unit": "%",   "improvement": "+28.8%"},
    ]

    data = {
        "heatPrediction": heat_pred,
        "loadingGroups":  loading_groups,
        "rhythmMatch":    rhythm_match,
        "improvements":   improvements,
    }
    save(out("scene2", "furnace-model.json"), data)

# ===========================================================================
# 6. scene3/kpi-service.json
#    MonthlyCompletion: {month, contractCount, contractTons, settledCount,
#                        settledTons, countRate, tonsRate}
# ===========================================================================
def build_kpi_service() -> None:
    path = DATA_DIR / "2026年结算合同完成率.xlsx"
    df = pd.read_excel(path, sheet_name="Sheet2",
                       header=None, engine="openpyxl")

    # Row layout (0-indexed):
    # 0: title
    # 1: 1月, 合同项, 合同量, 完成项, 准发量, 完成项率, 完成量率
    # 2: 合计, 4641, 102307.665, 3751, 94085, 0.808, 0.920
    # 3: 2月 header ... etc.

    records = []
    MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月"]
    row_idx = 0
    month_i = 0
    while row_idx < len(df) and month_i < 5:
        cell = safe_str(df.iloc[row_idx, 0])
        if cell in MONTH_LABELS:
            # Header row found; data is next row
            data_row = df.iloc[row_idx + 1]
            records.append({
                "month":         MONTH_LABELS[month_i],
                "contractCount": int(safe_float(data_row[1])),
                "contractTons":  round(safe_float(data_row[2]), 2),
                "settledCount":  int(safe_float(data_row[3])),
                "settledTons":   round(safe_float(data_row[4]), 2),
                "countRate":     round(safe_float(data_row[5]) * 100, 2),
                "tonsRate":      round(safe_float(data_row[6]) * 100, 2),
            })
            month_i += 1
            row_idx += 2
        else:
            row_idx += 1

    save(out("scene3", "kpi-service.json"), records)

# ===========================================================================
# 7. scene3/kpi-production.json
#    ProductLineContract: {productLine, contractCount, contractTons,
#                          backlogTons, completionRate}
# ===========================================================================
def build_kpi_production() -> None:
    path = DATA_DIR / "2026年销售合同执行汇总和订单变更情况.xlsx"
    df = pd.read_excel(path, sheet_name="生产确认合同完成率",
                       header=None, engine="openpyxl")

    # Row 0: title  Row 1: header  Row 2+: data rows
    # Col: 0=name, 1=合同总项, 2=完成项, 3=欠交项, 4=完成项率%, 5=欠交项率%,
    #      6=合同总量, 7=完成量, 8=欠交量, 9=完成量率%, 10=欠交量率%
    records = []
    SKIP = {"5月份确认合同完成情况", "确认合同", "nan", ""}
    for i in range(len(df)):
        row = df.iloc[i]
        name = safe_str(row[0])
        if name in SKIP:
            continue
        # Skip header row
        if "合同总项" in name or "完成项率" in name:
            continue
        contract_count = int(safe_float(row[1]))
        if contract_count == 0:
            continue
        records.append({
            "productLine":    name,
            "contractCount":  contract_count,
            "contractTons":   round(safe_float(row[6]), 1),
            "backlogTons":    round(safe_float(row[8]), 2),
            "completionRate": round(safe_float(row[9]), 2),
        })

    save(out("scene3", "kpi-production.json"), records)

# ===========================================================================
# 8. scene3/kpi-inventory.json
#    InventoryBucket: {steelCategory, stockCycle, weight}
# ===========================================================================
def build_kpi_inventory() -> None:
    path = DATA_DIR / "2026年5月底成品库存清单.xlsx"
    df = pd.read_excel(path, sheet_name="库存", engine="openpyxl")

    # Columns: 钢类, 库存周期, 重量
    df["重量"] = pd.to_numeric(df["重量"], errors="coerce").fillna(0)
    df = df.dropna(subset=["钢类", "库存周期"])

    grouped = df.groupby(["钢类", "库存周期"])["重量"].sum().reset_index()

    records = []
    for _, row in grouped.iterrows():
        records.append({
            "steelCategory": safe_str(row["钢类"]),
            "stockCycle":    safe_str(row["库存周期"]),
            "weight":        round(safe_float(row["重量"]), 4),
        })

    save(out("scene3", "kpi-inventory.json"), records)

# ===========================================================================
# 9. scene3/kpi-demand.json
#    MonthlyDemandAccuracy: {month, demandAccuracy}
#    Derived from settlement completion tonsRate as proxy for demand accuracy.
# ===========================================================================
def build_kpi_demand() -> None:
    path = DATA_DIR / "2026年结算合同完成率.xlsx"
    df = pd.read_excel(path, sheet_name="Sheet2",
                       header=None, engine="openpyxl")

    records = []
    MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月"]
    row_idx = 0
    month_i = 0
    while row_idx < len(df) and month_i < 5:
        cell = safe_str(df.iloc[row_idx, 0])
        if cell in MONTH_LABELS:
            data_row = df.iloc[row_idx + 1]
            tons_rate = safe_float(data_row[6])
            if tons_rate < 1:
                tons_rate *= 100   # convert from decimal if needed
            records.append({
                "month":          MONTH_LABELS[month_i],
                "demandAccuracy": round(tons_rate, 2),
            })
            month_i += 1
            row_idx += 2
        else:
            row_idx += 1

    save(out("scene3", "kpi-demand.json"), records)

# ===========================================================================
# MAIN
# ===========================================================================
def main() -> None:
    print("=== APS Demo Data Preprocessing ===")
    build_global_kpi()
    build_orders_sample()
    build_order_groups()
    build_gantt()
    build_furnace_model()
    build_kpi_service()
    build_kpi_production()
    build_kpi_inventory()
    build_kpi_demand()
    print("=== Done ===")

if __name__ == "__main__":
    main()
