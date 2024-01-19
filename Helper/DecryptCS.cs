using System.Security.Cryptography;
using System.Text;

namespace ST.ERP.Helper
{
    public class DecryptCS
    {
        public static string DecryptConnectionString(string cipherText,string password, byte[] salt)
        {
            var key = new Rfc2898DeriveBytes(password, salt);
            byte[] bytes = Convert.FromBase64String(cipherText);

            using (var algorithm = new AesManaged())
            {
                algorithm.Key = key.GetBytes(algorithm.KeySize / 8);
                algorithm.IV = key.GetBytes(algorithm.BlockSize / 8);

                using (var decryptor = algorithm.CreateDecryptor(algorithm.Key, algorithm.IV))
                {
                    using (var ms = new MemoryStream(bytes))
                    {
                        using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                        {
                            using (var sr = new StreamReader(cs))
                            {
                                return sr.ReadToEnd();
                            }
                        }
                    }
                }
            }
        }
    }
}
