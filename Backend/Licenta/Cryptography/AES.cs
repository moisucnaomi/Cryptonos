using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Licenta.Cryptography
{
    public class AES
    {
        #region Members
        private readonly byte[] defaultIV = new byte[]{ 161, 139, 242, 181, 137, 134, 177, 11, 197, 192, 23, 100, 204, 180, 85, 69 };
        #endregion

        #region Methods
        public EncryptedMessage Encrypt(string plainText)
        {
            byte[] encrypted;
            using (AesManaged aes = new AesManaged())
            {
                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, defaultIV);
                
                using (MemoryStream ms = new MemoryStream())
                {  
                    using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter sw = new StreamWriter(cs))
                            sw.Write(plainText);
                        encrypted = ms.ToArray();
                    }
                } 
                return new EncryptedMessage(aes.Key, encrypted);
            }
            
        }

        public string Decrypt(byte[] cipherText, byte[] Key)
        {
            string plaintext = null;   
            using (AesManaged aes = new AesManaged())
            {
                ICryptoTransform decryptor = aes.CreateDecryptor(Key, defaultIV);

                using (MemoryStream ms = new MemoryStream(cipherText))
                { 
                    using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                    {   
                        using (StreamReader reader = new StreamReader(cs))
                            plaintext = reader.ReadToEnd();
                    }
                }
            }
            return plaintext;
        }
        #endregion
    }
}
