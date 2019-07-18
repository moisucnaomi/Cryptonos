using Licenta.Steganography;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Cryptonos.WebAPI.Controllers
{
    public class MainApiController : ApiController
    {
        #region Members
        private SteganographyController _steganographyController;
        private SteganographyHelper _steganographyHelper;
        #endregion

        #region Properties
        public SteganographyController SteganographyController
        {
            get
            {
                if (_steganographyController == null)
                    _steganographyController = new SteganographyController();
                return _steganographyController;
            }
        }

        public SteganographyHelper SteganographyHelper
        {
            get
            {
                if (_steganographyHelper == null)
                    _steganographyHelper = new SteganographyHelper();
                return _steganographyHelper;
            }
        }
        #endregion
    }
}
