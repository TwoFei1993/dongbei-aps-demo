"""
Excel data exploration script - reads all client data files and prints structure.
Uses proper encoding handling for Chinese text.
"""
import pandas as pd
import os
import sys

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

DATA_DIR = "c:/Users/shaoy/Desktop/麦肯锡/东北特钢/Client Data"

files = [
    "2026年5月底成品库存清单.xlsx",
    "2026年结算合同完成率.xlsx",
    "2026年销售合同执行汇总和订单变更情况.xlsx",
    "5月排产合同.xlsx",
    "6月21日炼钢厂西区72小时作业计划.xlsx",
    "炼钢厂东区72小时作业计划6-21.xlsx",
    "生产管理处--2026年5月份主要指标表.xlsx",
    "东北特殊钢股份2026年5月份在制品汇总（6.5-9）.xlsx",
    "2026年第二轧钢厂过程分析材料.xlsx",
]

for filename in files:
    path = os.path.join(DATA_DIR, filename)
    print(f"\n{'='*60}")
    print(f"FILE: {filename}")
    print('='*60)
    try:
        xl = pd.ExcelFile(path, engine='openpyxl')
        print(f"Sheets: {xl.sheet_names}")
        for sheet in xl.sheet_names[:3]:  # first 3 sheets only
            print(f"\n  --- Sheet: {sheet} ---")
            df = pd.read_excel(path, sheet_name=sheet, nrows=8, engine='openpyxl')
            print(f"  Shape: {df.shape}")
            print(f"  Columns (first 15): {list(df.columns)[:15]}")
            if len(df) > 0:
                print(f"  Row 0: {df.iloc[0, :10].tolist()}")
                if len(df) > 1:
                    print(f"  Row 1: {df.iloc[1, :10].tolist()}")
                if len(df) > 2:
                    print(f"  Row 2: {df.iloc[2, :10].tolist()}")
    except Exception as e:
        print(f"  ERROR: {e}")
