using Licenta.Models;
using Licenta.Steganography;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Cryptonos.WebAPI.Controllers
{
    [RoutePrefix("steganography")]
    public class SteganographyController : MainApiController
    {
        #region Methods
        [HttpPost]
        [Route("encrypt")]
        public HiddenMessage Encrypt()
        {
            HttpRequest httpRequest = HttpContext.Current.Request;

            HttpPostedFile postedFile = httpRequest.Files["Image"];
            string message = httpRequest.Params["Message"];

            List<int> selectedBitList = new List<int>();
            httpRequest.Params["SelectedBits"].Split(',').ToList().ForEach(bit => selectedBitList.Add(int.Parse(bit)));
            int[] selectedBits = selectedBitList.ToArray();

            string encrypt = httpRequest.Params["Encrypt"];

            Image img = Image.FromStream(postedFile.InputStream, true, true);

            if (message.Length * 8 > img.Height * img.Width * 3 * selectedBits.Length)
            {
                HttpResponseMessage response = this.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Message does not fit in the image");
                throw new HttpResponseException(response);
            }

            return SteganographyHelper.Hide(message, img, selectedBits, encrypt);
        }

        [HttpPost]
        [Route("decrypt")]
        public string Decrypt()
        {
            HttpRequest httpRequest = HttpContext.Current.Request;

            HttpPostedFile postedFile = httpRequest.Files["Image"];
            string secretKey = httpRequest.Params["SecretKey"];
            byte[] key;

            try
            {
                key = Convert.FromBase64String(secretKey);
            } catch (Exception)
            {
                HttpResponseMessage response = this.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invaid key length");
                throw new HttpResponseException(response);
            }

            List<int> selectedBitList = new List<int>();
            httpRequest.Params["SelectedBits"].Split(',').ToList().ForEach(bit => selectedBitList.Add(int.Parse(bit)));
            int[] selectedBits = selectedBitList.ToArray();

            string decrypt = httpRequest.Params["Decrypt"];

            Image img = Image.FromStream(postedFile.InputStream, true, true);
            return SteganographyHelper.Extract(img, key, selectedBits, decrypt);
        }        
        #endregion
    }
}
