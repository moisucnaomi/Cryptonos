using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Licenta
{
    public class EncryptedMessage
    {
        #region Properties
        public byte[] Key { get; set; }

        public byte[] Message { get; set; }
        #endregion

        #region Constructors
        public EncryptedMessage(byte[] key, byte[] encrypted)
        {
            Key = key;
            Message = encrypted;
        }
        #endregion
    }
}