"""
Final exploration checks before writing process-data.py
"""
import pandas as pd
import sys
sys.stdout.reconfigure(encoding='utf-8')

DATA_DIR = "c:/Users/shaoy/Desktop/麦肯锡/东北特钢/Client Data"

# Check 生产确认合同完成率 sheet in sales contract file
print("\n" + "="*60)
print("DETAILED: 生产确认合同完成率 - all rows")
print("="*60)
df = pd.read_excel(f"{DATA_DIR}/2026年销售合同执行汇总和订单变更情况.xlsx",
                   sheet_name='生产确认合同完成率', header=None, engine='openpyxl')
for i, row in df.iterrows():
    print(f"  {i}: {row.tolist()}")

# Check 5月排产合同 - 产线代码 vs 设备 mapping and 是否结案
print("\n" + "="*60)
print("DETAILED: 5月排产合同 - 是否结案 distribution")
print("="*60)
df2 = pd.read_excel(f"{DATA_DIR}/5月排产合同.xlsx", sheet_name='Sheet', engine='openpyxl')
print(f"是否结案 counts:\n{df2['是否结案'].value_counts()}")
print(f"产线代码 counts:\n{df2['产线代码'].value_counts()}")

# Check 生产管理处 - search for OEE or specific KPI rows
print("\n" + "="*60)
print("DETAILED: 主要指标表 - rows 20-60")
print("="*60)
df3 = pd.read_excel(f"{DATA_DIR}/生产管理处--2026年5月份主要指标表.xlsx",
                    sheet_name='主要指标表模板', header=None, engine='openpyxl')
print(f"Total rows: {len(df3)}")
for i in range(min(60, len(df3))):
    row = df3.iloc[i]
    if row[0] is not None and str(row[0]).strip():
        print(f"  {i}: col0={str(row[0])[:40]:40s} | col6={row[6]} | col8={row[8]} | col9={row[9]} | col10={row[10]}")
