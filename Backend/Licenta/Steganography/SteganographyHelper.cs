using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using Licenta.Enums;
using Licenta.Cryptography;
using Licenta.Models;
using System.IO;
using System.Drawing.Imaging;
using System.Diagnostics.Contracts;

namespace Licenta.Steganography
{
    public class SteganographyHelper
    {
        #region Properties
        public AES Encryptor { get; set; }
        #endregion
        
        #region Constructors
        public SteganographyHelper()
        {
            Encryptor = new AES();
        }
        #endregion

        public static void Main()
        {
           
        }

        #region Methods
        public HiddenMessage Hide(string message, Image src, int[] selectedBits, string encrypt)
        {
            Bitmap originalImage = CreateNonIndexedImage(src);
            Bitmap finalImage;
            string key = "";
            if (encrypt.Equals("true"))
            {
                EncryptedMessage encryptedMessage = Encryptor.Encrypt(message);
                string encryptedData = Convert.ToBase64String(encryptedMessage.Message);
                key = Convert.ToBase64String(encryptedMessage.Key);
                finalImage = MergeText(encryptedData, originalImage, selectedBits);
            }
            else
            {
                finalImage = MergeText(message, originalImage, selectedBits);
            }
            
            MemoryStream memoryStream = new MemoryStream();
            finalImage.Save(memoryStream, ImageFormat.Bmp);
            byte[] bitmapRecord = memoryStream.ToArray();

            return new HiddenMessage(bitmapRecord, key, message.Length, (message.Length * 8) / (3 * selectedBits.Length), finalImage.Width, finalImage.Height);
        }

        public string Extract(Image src, byte[] key, int[] selectedBits, string decrypt)
        {
            string myData = this.ExtractText(
                new Bitmap(src), selectedBits
            ).ToString();

            if (decrypt.Equals("true"))
            {
                myData = Encryptor.Decrypt(Convert.FromBase64String(myData), key);
            }
            
            return myData;
        }

        public Bitmap CreateNonIndexedImage(Image src)
        {
            
            Bitmap newBmp = new Bitmap(src.Width, src.Height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
            using (Graphics gfx = Graphics.FromImage(newBmp))
            {
                gfx.DrawImage(src, 0, 0, src.Width, src.Height);
            }
            newBmp.SetResolution(src.HorizontalResolution, src.VerticalResolution);
            return newBmp;
        }

        public Bitmap MergeText(string text, Bitmap bmp, int[] selectedBits)
        {
            State s = State.HIDING;

            int charIndex = 0;
            int charValue = 0;
            long colorUnitIndex = 0;

            int highPower = 2;
            int lowPower = 2;

            int zeros = 0;

            int R = 0, G = 0, B = 0;

            for (int i = 0; i < bmp.Height; i++)
            {
                for (int j = 0; j < bmp.Width; j++)
                {
                    for (int bit=0; bit<selectedBits.Length; bit++)
                    {
                        highPower = (int) Math.Pow(2,selectedBits[bit]);
                        lowPower = (int) Math.Pow(2, selectedBits[bit] - 1);

                        Color pixel = bmp.GetPixel(j, i);

                        pixel = Color.FromArgb(pixel.R - (pixel.R % highPower - pixel.R % lowPower),
                        pixel.G - (pixel.G % highPower - pixel.G % lowPower), pixel.B - (pixel.B % highPower - pixel.B % lowPower));

                        R = pixel.R;
                        G = pixel.G;
                        B = pixel.B;

                        for (int n = 0; n < 3; n++)
                        {
                            if (colorUnitIndex % 8 == 0)
                            {
                                if (zeros == 8)
                                {
                                    if ((colorUnitIndex - 1) % 3 < 2)
                                    {
                                        bmp.SetPixel(j, i, Color.FromArgb(R, G, B));
                                    }

                                    return bmp;
                                }

                                if (charIndex >= text.Length)
                                {
                                    s = State.FILL_WITH_ZEROS;
                                }
                                else
                                {
                                    charValue = text[charIndex++];
                                }
                            }

                            switch (colorUnitIndex % 3)
                            {
                                case 0:
                                    {
                                        if (s == State.HIDING)
                                        {
                                            R += charValue % 2 * lowPower;

                                            charValue /= 2;
                                        }
                                    }
                                    break;
                                case 1:
                                    {
                                        if (s == State.HIDING)
                                        {
                                            G += charValue % 2 * lowPower;

                                            charValue /= 2;
                                        }
                                    }
                                    break;
                                case 2:
                                    {
                                        if (s == State.HIDING)
                                        {
                                            B += charValue % 2 * lowPower;

                                            charValue /= 2;
                                        }

                                        bmp.SetPixel(j, i, Color.FromArgb(R, G, B));
                                    }
                                    break;
                            }

                            colorUnitIndex++;

                            if (s == State.FILL_WITH_ZEROS)
                            {
                                zeros++;
                            }
                        }
                    }
                    
                }
            }

            return bmp;
        }

        public StringBuilder ExtractText(Bitmap bmp, int[] selectedBits)
        {
            int colorUnitIndex = 0;
            int charValue = 0;
            int pow = 1;

            int highPower = 2;
            int lowPower = 2;
            
            StringBuilder extractedText = new StringBuilder();

            for (int i = 0; i < bmp.Height; i++)
            {
                for (int j = 0; j < bmp.Width; j++)
                {
                    Color pixel = bmp.GetPixel(j, i);

                    for (int bit = 0; bit < selectedBits.Length; bit++)
                    {
                        highPower = (int)Math.Pow(2, selectedBits[bit]);
                        lowPower = (int)Math.Pow(2, selectedBits[bit] - 1);

                        for (int n = 0; n < 3; n++)
                        {
                            switch (colorUnitIndex % 3)
                            {
                                case 0:
                                    {
                                        charValue = charValue + ((pixel.R % highPower - pixel.R % lowPower) / lowPower) * pow;
                                        pow *= 2;
                                    }
                                    break;
                                case 1:
                                    {
                                        charValue = charValue + ((pixel.G % highPower - pixel.G % lowPower) / lowPower) * pow;
                                        pow *= 2;
                                    }
                                    break;
                                case 2:
                                    {
                                        charValue = charValue + ((pixel.B % highPower - pixel.B % lowPower) / lowPower) * pow;
                                        pow *= 2;
                                    }
                                    break;
                            }

                            colorUnitIndex++;

                            if (colorUnitIndex % 8 == 0)
                            {
                                if (charValue == 0)
                                {
                                    return extractedText;
                                }

                                char c = (char)charValue;

                                extractedText.Append(c.ToString());

                                charValue = 0;
                                pow = 1;
                            }
                        }
                    }
                }
            }

            return extractedText;
        }
        #endregion
    }
}
