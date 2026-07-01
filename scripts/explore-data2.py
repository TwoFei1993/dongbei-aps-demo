"""
Detailed exploration of key files.
"""
import pandas as pd
import sys
sys.stdout.reconfigure(encoding='utf-8')

DATA_DIR = "c:/Users/shaoy/Desktop/麦肯锡/东北特钢/Client Data"

# Explore settlement completion rate file in detail
print("\n" + "="*60)
print("DETAILED: 2026年结算合同完成率.xlsx")
print("="*60)
df = pd.read_excel(f"{DATA_DIR}/2026年结算合同完成率.xlsx", sheet_name='Sheet2',
                    header=None, engine='openpyxl')
print("All rows:")
for i, row in df.iterrows():
    print(f"  {i}: {row.tolist()}")

# Explore inventory file
print("\n" + "="*60)
print("DETAILED: 2026年5月底成品库存清单.xlsx - 库存 sheet")
print("="*60)
df2 = pd.read_excel(f"{DATA_DIR}/2026年5月底成品库存清单.xlsx", sheet_name='库存',
                     nrows=5, engine='openpyxl')
print(f"Columns: {list(df2.columns)}")
print(f"All 42 cols: {list(df2.columns)}")

# Explore 5月排产合同 in detail
print("\n" + "="*60)
print("DETAILED: 5月排产合同.xlsx - all columns")
print("="*60)
df3 = pd.read_excel(f"{DATA_DIR}/5月排产合同.xlsx", sheet_name='Sheet',
                     nrows=5, engine='openpyxl')
print(f"All columns: {list(df3.columns)}")
print(f"Row 0: {df3.iloc[0].to_dict()}")

# Explore 生产管理处 KPI table
print("\n" + "="*60)
print("DETAILED: 生产管理处--2026年5月份主要指标表.xlsx")
print("="*60)
df4 = pd.read_excel(f"{DATA_DIR}/生产管理处--2026年5月份主要指标表.xlsx",
                     sheet_name='主要指标表模板',
                     nrows=20, engine='openpyxl')
print(f"Columns: {list(df4.columns)}")
for i in range(min(20, len(df4))):
    row = df4.iloc[i]
    print(f"  Row {i}: {row[:8].tolist()}")

# Explore 西区72小时 sheet Sheet1
print("\n" + "="*60)
print("DETAILED: 6月21日炼钢厂西区72小时作业计划.xlsx - Sheet1")
print("="*60)
df5 = pd.read_excel(f"{DATA_DIR}/6月21日炼钢厂西区72小时作业计划.xlsx",
                     sheet_name='Sheet1',
                     nrows=30, header=None, engine='openpyxl')
print(f"Rows: {len(df5)}")
for i in range(min(30, len(df5))):
    print(f"  {i}: {df5.iloc[i, :9].tolist()}")
