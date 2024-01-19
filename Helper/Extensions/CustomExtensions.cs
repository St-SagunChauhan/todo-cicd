using System.ComponentModel;
using System.Reflection;

namespace ST.ERP.Helper.Extensions
{
	public static class CustomExtensions
	{
		public static T[] ToArray<T>(this T withSingleItem)
		{
			return new[] { withSingleItem };
		}

        public static string GetEnumDescription(Enum value)
        {
            FieldInfo field = value.GetType().GetField(value.ToString());

            if (field != null)
            {
                if (Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute)) is DescriptionAttribute attribute)
                {
                    return attribute.Description;
                }
            }

            return value.ToString();
        }
    }
}
