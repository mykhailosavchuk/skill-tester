﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Testeria.Models
{
    public class AuthToken
    {
        public string AccessToken { get; set; }
        public int ExpiresIn { get; set; }
    }
}
