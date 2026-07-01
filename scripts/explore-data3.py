"""
More exploration of key files - sales contract execution and inventory details.
"""
import pandas as pd
import sys
sys.stdout.reconfigure(encoding='utf-8')

DATA_DIR = "c:/Users/shaoy/Desktop/麦肯锡/东北特钢/Client Data"

# Explore inventory more closely - 库存周期 column
print("\n" + "="*60)
print("DETAILED: 库存清单 - 钢类 and 库存周期")
print("="*60)
df_inv = pd.read_excel(f"{DATA_DIR}/2026年5月底成品库存清单.xlsx",
                        sheet_name='库存', engine='openpyxl')
print(f"Total rows: {len(df_inv)}")
print(f"钢类 unique: {df_inv['钢类'].unique()[:20]}")
print(f"库存周期 unique: {df_inv['库存周期'].unique()}")
print(f"重量 sum: {df_inv['重量'].sum():.2f}")

# Group by 钢类 and 库存周期
grouped = df_inv.groupby(['钢类', '库存周期'])['重量'].sum().reset_index()
print("\nGrouped by 钢类 + 库存周期:")
print(grouped.to_string())

# Explore 生产订单执行 for product line data
print("\n" + "="*60)
print("DETAILED: 生产订单执行-6.1调取 - 产线 data")
print("="*60)
df_orders = pd.read_excel(f"{DATA_DIR}/2026年销售合同执行汇总和订单变更情况.xlsx",
                           sheet_name='生产订单执行-6.1调取', engine='openpyxl')
print(f"Total rows: {len(df_orders)}")
print(f"产线 unique: {df_orders['产线'].unique()}")
print(f"月份 range: {df_orders['月份'].min()} to {df_orders['月份'].max()}")
# Group by product line
pl_grouped = df_orders.groupby('产线').agg(
    合同数=('合同号', 'count'),
    排产量合计=('排产量', 'sum'),
    轧材量合计=('轧材量', 'sum'),
    准发欠交量合计=('准发欠交量', 'sum'),
    准发量合计=('准发合格量', 'sum'),
).reset_index()
print("\nBy product line:")
print(pl_grouped.to_string())

# Check 5月排产合同 for row count and field mapping
print("\n" + "="*60)
print("DETAILED: 5月排产合同 - shape and key columns")
print("="*60)
df_prod = pd.read_excel(f"{DATA_DIR}/5月排产合同.xlsx", sheet_name='Sheet', engine='openpyxl')
print(f"Total rows: {len(df_prod)}")
print(f"产线代码 unique: {df_prod['产线代码'].unique()}")
print(f"钢类 unique: {df_prod['钢类'].unique()[:15]}")
print(f"形状 unique: {df_prod['形状'].unique()[:15]}")
print(f"\nSample rows (first 3):")
for i in range(3):
    row = df_prod.iloc[i]
    print(f"  {row[['合同号', '产线代码', '设备', '钢类', '钢种', '形状', '订单重量', '厚度', '宽度', '长度', '交期时间', '交货状态']].to_dict()}")
