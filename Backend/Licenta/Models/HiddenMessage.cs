using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Licenta.Models
{
    [DataContract]
    public class HiddenMessage
    {
        #region Properties
        [DataMember]
        public byte[] Image { set; get; }

        [DataMember]
        public string Key { set;  get; }

        [DataMember]
        public int HiddenCharacters { set; get; }

        [DataMember]
        public int UsedPixels { set; get; }

        [DataMember]
        public int ImageWidth { set; get; }

        [DataMember]
        public int ImageHeight { set; get; }
        #endregion

        #region Constructors
        public HiddenMessage(byte[] img, string key, int hiddenCharacters, int usedPixels, int imageWidth, int imageHeight)
        {
            Image = img;
            Key = key;
            HiddenCharacters = hiddenCharacters;
            UsedPixels = usedPixels;
            ImageWidth = imageWidth;
            ImageHeight = imageHeight;
        }
        #endregion
    }
}
