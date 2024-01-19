using Microsoft.EntityFrameworkCore.Metadata.Internal;
using OfficeOpenXml;

namespace ST.ERP.Helper.Impoter_Utilites
{
    public static class UploadExcelFile
    {
        public static List<T> GetExcelData<T>(ExcelWorksheet sheet)
        {
            List<T> list = new List<T>();
            var columnInfo = Enumerable.Range(1, sheet.Dimension.Columns).ToList().Select(n =>
                new { Index = n, ColumnName = sheet.Cells[1, n].Value?.ToString() }
            );
            for (int row = 2; row <= sheet.Dimension.Rows; row++)
            {
                T obj = Activator.CreateInstance<T>(); // generic object
                foreach (var prop in typeof(T).GetProperties())
                {
                    try
                    {
                        var column = columnInfo.FirstOrDefault(c => c.ColumnName?.Replace(" ", "") == prop.Name);
                        if (column is not null)
                        {
                            var col = column.Index;
                            var val = sheet.Cells[row, col].Value;
                            var propType = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;

                            if (val == null)
                            {
                                if (propType.IsValueType)
                                {
                                    prop.SetValue(obj, Activator.CreateInstance(propType));
                                }
                                else
                                {
                                    prop.SetValue(obj, null);
                                }
                            }
                            else if (propType == typeof(DateTime))
                            {
                                var dateValue = Convert.ToDateTime(val).ToString("yyyy-MM-dd");
                                prop.SetValue(obj, Convert.ChangeType(dateValue, propType));
                            }
                            else
                            {
                                prop.SetValue(obj, Convert.ChangeType(val, propType));
                            }
                        }
                        else
                        {
                            throw new Exception($"Column {prop.Name} doesn't exist.");
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new AppException($"{ex.Message}");
                    }
                }
                list.Add(obj);
            }
            return list;
        }
    }
}
