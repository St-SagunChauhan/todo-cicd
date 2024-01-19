namespace ST.ERP.Helper
{
    public class DictionaryToStringConverter
    {
        public static string DictionaryToString(Dictionary<string, decimal> dictionary)
        {
            string dictionaryString = "{";
            foreach (KeyValuePair<string, decimal> keyValues in dictionary)
            {
                dictionaryString += keyValues.Key + " : " + keyValues.Value + ", ";
            }
            return dictionaryString.TrimEnd(',', ' ') + "}";
        }
    }
}
