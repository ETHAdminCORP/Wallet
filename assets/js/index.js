$(document).ready(function () {
    $('.sidenav').sidenav();
    $('select').formSelect();

    $('body').addClass($('#langId').val());

    $('.modal').modal({
        opacity: 0.5,
        inDuration: 350
    });

    let changeTab = () => {
        setTimeout(function () {
            if ($('#transactions').css('display') === 'block') {
                $('.tabs').tabs('updateTabIndicator');
                if ($("#networkName").val() === 'mainnet') {
                    setTimeout(function () {
                        let integrationFrame = $('#integrationFrame');
                        if (integrationFrame.css('display') === 'block') {
                            $.get("/stat/", {key: "txViz", value: '', value2: '', address: MD5(window.address)});
                            let requestAddress = `https://www.ethtective.com/address/${window.address}`;
                            integrationFrame.append(`<iframe id="ethtectiveFrame" src="${requestAddress}" frameborder="0"></iframe>`);
                        }
                        else {
                            $('#ethtectiveFrame').remove();
                        }
                    }, 100);
                }
                else {
                    $('#frameTab').addClass('disabled');
                    if ($.cookie('lang') === 'en-US') {
                        $('#frameTab a').html('Visualization - only available in mainnet');
                    }
                    else {
                        $('#frameTab a').html('Визуализация - доступно только в mainnet');
                    }
                }
            }
            else {
                $('#ethtectiveFrame').remove();
            }
        }, 100);
    };

    $('.tabs').tabs({onShow: changeTab});

    $('#walletTypePrivateKey').on('click', function () {


        setTimeout(function () {
            $('#unencryptPrivateKeyRaw').focus();

        }, 100)

    });
});

function contractMore(address) {
    let contact = $('#contractTabLink');
    contact[0].click();
    $('#contractAddress').val(address);
    $('#contractAddress').trigger('input');
    $('#contractAddress').focus();
}


// auto logout
var idleTime;
$(document).ready(function () {
    reloadPage();
    $('html').bind('mousemove click mouseup mousedown keydown keypress keyup submit change mouseenter scroll resize dblclick', function () {
        clearTimeout(idleTime);
        reloadPage();
    });
});

function reloadPage() {
    clearTimeout(idleTime);
    idleTime = setTimeout(function () {
        if ($("#start").is(":hidden")) {
            location.reload();
        }
    }, 600000);
}

$('#passEye').click(function () {
    let passwordInput = $("#passwordForNewUTC");
    if (passwordInput.attr("type") === "text") {
        passwordInput.attr("type", "password");
        $('#passEye').css('opacity', '1');
    }
    else {
        passwordInput.attr("type", "text");
        $('#passEye').css('opacity', '0.5');
    }
});


$(document).mouseup(function (e) {
    if ($("#tokens").css("display") === "block") {
        let container = $("#tokenTable");
        if (container.has(e.target).length === 0) {
            for (let i = 0; i < tokenAddressArray.length; i++) {
                $('#transferTokenDiv-' + tokenAddressArray[i]).hide();
                $('#transferTokenButton-' + tokenAddressArray[i]).show();
                $('#tokenExchangeLink-' + tokenAddressArray[i]).show();
            }
        }
    }
});


function MD5(str) {

    var RotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };

    var AddUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    };
    var G = function (x, y, z) {
        return (x & z) | (y & (~z));
    };
    var H = function (x, y, z) {
        return (x ^ y ^ z);
    };
    var I = function (x, y, z) {
        return (y ^ (x | (~z)));
    };

    var FF = function (a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    var GG = function (a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    var HH = function (a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    var II = function (a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    var ConvertToWordArray = function (str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var WordToHex = function (lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    //str = this.utf8_encode(str);
    x = ConvertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }

    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

    return temp.toLowerCase();
}


window.addEventListener("load", async () => {




    // If metamask found, set Metamask's div color - green
    if (window.ethereum || window.web3) {
        $("#walletTypeMetamask").css("background-color", "#08e2d4");
        $("#walletTypeMetamask").hover(function () {
            $(this).css("background-color", "#0FDCCF")
        }).mouseout(function () {
            $(this).css({
                "background-color": "#08e2d4",
            });
        });
    } else {
        $("#walletTypeMetamask").insertAfter($("#walletTypePrivateKey"));
        $("#walletTypeMetamask").hover(function () {
            $(this).css("background-color", "#FAFAFA")
        }).mouseout(function () {
            $(this).css({
                "background-color": "#ffffff",
            });
        });
    }


    var w3 = new Web3();


    //hover colors
    $("#walletTypePrivateKey").hover(function () {
        if ($("#unencryptPrivateKey").is(":visible") == false) {
            $(this).css("background-color", "#FAFAFA")
        }
    }).mouseout(function () {
        $(this).css({
            "background-color": "#ffffff",
        });
    })

    $('#walletTypeParitySigner').hover(function () {
        $(this).css("background-color", "#FAFAFA")
    }).mouseout(function () {
        $(this).css({
            "background-color": "#ffffff",
        });
    })


    $("#walletTypeSeed").hover(function () {
        if ($("#seedRow").is(":visible") == false) {
            $(this).css("background-color", "#FAFAFA")
        }
    }).mouseout(function () {
        $(this).css({
            "background-color": "#ffffff",
        });
    })

    $("#walletTypePrivateKeyUTC").hover(function () {
        if ($("#walletTypePrivateKeyUTCdiv").is(":visible") == false) {
            $(this).css("background-color", "#FAFAFA")
        }
    }).mouseout(function () {
        $(this).css({
            "background-color": "#ffffff",
        });
    })


    $('#buttonSendEth').click(function () {
        $('#modal1').modal('open');
    })

    $('#sendEthAddParamsLink2').click(function () {
        $('#modal1').modal('open');
        $('#sendEthAddParams').css('display', 'block');
    })


    window.copyToClipboard = function (element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
        $(element).css('background-color', '#08e2d4');
        setTimeout(hideHighlight, 400, element);

    }

    function hideHighlight(element) {
        $(element).css('background-color', "rgba(0, 0, 0, 0)")
    }


    $(this).attr('autocomplete', 'off');


    $('#walletLanguage').val($('#langId').val());
    $('#walletLanguage').formSelect();

    $('#walletLanguage').on('change', function () {
        $.cookie('lang', this.value, {
            expires: 365
        });
        location.reload();
    });


    $('#sendEthAddParamsLink').mousedown(function () {
        if ($("#sendEthAddParams").is(":visible") == true) {
            $("#sendEthAddParams").hide();
            $("#sendEthImgParams").attr("src", "/assets/img/linedown.png");
        } else {
            $("#sendEthAddParams").show();
            $("#sendEthImgParams").attr("src", "/assets/img/lineup.png");
        }
    })

    var flip = 0;
    $('#sendEthAddParamsLink').mousedown(function () {
        $("#sendEthAddParams").toggle(flip++ % 2 === 0);
    });


    $('#passwordForNewUTC').on('input', function () {
        $('#newAddressErr').hide();
    })


    $('#ButtonPrivateKeyUTCEnter').mousedown(function () {
        $('#privateKeyUTCPassword').val()
        try {
            accountObj = w3.eth.accounts.decrypt(UTCFileSource, $('#privateKeyUTCPassword').val())
            address = accountObj.address
            privKey = accountObj.privateKey
            window.UTCOK = true
            addressInfo(2, privKey, address)
        } catch (e) {
            $('#keystoreDecryptError').show();
        }

    })

    $('#passwordForNewUTC').focus(function () {
        $('#walletTypePrivateKeyUTCdiv').hide();
        $('#unencryptPrivateKey').hide();
        $('#seedRow').hide();
        $('#metamaskBlockWarning').hide();
    })

    // New wallet - generate UTC file
    $('#buttonNewAdddressGoStep2').mousedown(function () {
        if ($('#passwordForNewUTC').val().length > 5) {
            //const accounts = new Accounts();
            //const accountObject = accounts.new();
            accountObject = w3.eth.accounts.create()
            var j = w3.eth.accounts.encrypt(accountObject.privateKey, $('#passwordForNewUTC').val());
            var d = new Date();
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(j)));
            element.setAttribute('download', 'UTC--' + d.toISOString().replace(/:/g, '-') + '--' + accountObject.address);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            $('#newAddressStep1').hide();
            addressInfo(4, accountObject.privateKey);
        } else {
            $('#newAddressErr').show();
        }
    });

    $("#passwordForNewUTC").keydown(function (e) {
        if (e.keyCode == 13) {
            $('#buttonNewAdddressGoStep2').mousedown();
        }
    });


    $("#walletTypePrivateKey").mousedown(function () {
        $('#unencryptPrivateKey').show();
        $("#unencryptPrivateKeyRaw").focus();
        $('#walletTypePrivateKeyUTCdiv').hide();
        $('#seedRow').hide();
        $('#metamaskBlockWarning').hide();
        $('#unencryptPrivateKeyRaw').focus();
    })

    $("#buttonPayByEth").mousedown(function () {
        $("#sendEthBalance").text($("#addressBalance").text());
    })


    $('#walletTypeSeed').mousedown(function () {
        $('#walletTypePrivateKeyUTCdiv').hide();
        $('#unencryptPrivateKey').hide();
        $('#metamaskBlockWarning').hide();
        $('#seedRow').show();
    })

    UTCOK = false;
    $("#walletTypePrivateKeyUTC").mousedown(function () {
        if (!UTCOK) {
            $('#unencryptPrivateKey').hide();
            $('#seedRow').hide();
            $('#metamaskBlockWarning').hide();
            if ($("#walletTypePrivateKeyUTCdiv").is(':hidden')) {
                document.getElementById('walletTypePrivateKeyUTCFile').click();
            }
        }
    })

    $("#walletTypePrivateKeyUTCHeader").mousedown(function () {
        $('#unencryptPrivateKey').hide();
        $('#seedRow').hide();
        if (!$("#walletTypePrivateKeyUTCdiv").is(':hidden')) {
            document.getElementById('walletTypePrivateKeyUTCFile').click();
        }
    })


    $("#walletTypePrivateKeyUTCFile").change(function () {
        if (!window.FileReader) {
            return alert('FileReader API is not supported by your browser.');
        }
        var $i = $('#walletTypePrivateKeyUTCFile'), // Put file input ID here
            input = $i[0]; // Getting the element from jQuery
        if (input.files && input.files[0]) {
            file = input.files[0]; // The file
            fr = new FileReader(); // FileReader instance
            fr.onloadend = function () {
                window.UTCFileSource = fr.result;
            };

            fr.readAsText(file);
        } else {
            // Handle errors here
            $('#walletTypePrivateKeyUTCdiv').hide();
        }
        $("#walletTypePrivateKeyUTCdiv").show();
        $("#privateKeyUTCPassword").focus();
    })


    $('#cardSendEthButtonSend').click(function () {
        checkSendEth('card')
        //$('#sendEthButtonSend').trigger("mousedown");
    })

    $('#cardSendEthButtonOk').click(function () {
        $('#sendEthButtonOk').click()
    })


    function cardCheckSendEth() {
        $('#sendEthAddress').val($('#cardSendEthAddress').val())
        $('#sendEthAmount').val($('#cardSendEthAmount').val());
        checkSendEth()
    }


    function checkSendEth(from) {
        from = from || 'modal';


        var inputAddressVal = $('#sendEthAddress').val();
        var inputEthVal = $('#sendEthAmount').val();
        var sendEthAddressErr = 0;
        var sendEthAmountErr = 0;

        if (inputAddressVal.length == 0) {
            sendEthAddressErr += 1;
        }
        if (inputAddressVal.length > 0 && !web3.utils.isAddress(inputAddressVal)) {
            sendEthAddressErr += 1;
            $('#sendEthAddress').css("border-color", 'red');
            $('#cardSendEthAddress').css("border-color", 'red');
        } else {
            $('#sendEthAddress').css("border-color", '#9e9e9e');
            $('#cardSendEthAddress').css("border-color", '#9e9e9e');
        }

        if (inputEthVal.length == 0) {
            sendEthAmountErr += 1;
        }
        if (inputEthVal.length > 0 && $('#sendEthAmount').val() > Number($('#addressBalance').text()) || Number(inputEthVal) == 0) {
            sendEthAmountErr += 1;
            $('#sendEthAmount').css("border-color", 'red');
            $('#cardSendEthAmount').css("border-color", 'red');
        } else {
            $('#sendEthAmount').css("border-color", '#9e9e9e');
            $('#cardSendEthAmount').css("border-color", '#9e9e9e');
        }

        if ((Number($('#sendEthCommission').text()) + Number($('#sendEthAmount').val())) > Number($('#addressBalance').text())) {
            sendEthAmountErr += 1;
            $('#sendEthAmount').css("border-color", "red");
            $('#cardSendEthAmount').css("border-color", "red");
        } else {
            $('#sendEthAmount').css("border-color", "#9e9e9e");
            $('#cardSendEthAmount').css("border-color", "#9e9e9e");
        }


        if (sendEthAmountErr > 0 || sendEthAddressErr > 0) {

            $('#sendEthButtonSend').show();
            $('#sendEthButtonOk').hide();
            $('#sendEthButtonSend').attr('disabled', 'disabled');
            $('#cardSendEthButtonOk').hide()
            $('#cardSendEthButtonSend').show()

        } else {
            if (from == 'modal') {
                $('#sendEthButtonSend').removeAttr('disabled');
            }
            else {
                $('#sendEthButtonSend').removeAttr('disabled');
                $('#sendEthButtonSend').trigger('mousedown')
                $('#cardSendEthButtonSend').hide();
                $('#cardSendEthButtonOk').show();

            }
        }

    }


    $('#sendEthAddress').on('input', function () {
        $('#cardSendEthAddress').val($('#sendEthAddress').val())

        checkSendEth();
    })

//Card
    $('#cardSendEthAddress').on('input', function () {
        cardCheckSendEth();
    })


    $('#cardSendEthAmount').on('input', function () {
        //var sendEthAmountNumber = Number($('#sendEthAmount').val())
        cardCheckSendEth();
    })


    $('#sendEthAmount').on('input', function () {
        $('#cardSendEthAmount').val($('#sendEthAmount').val())

        $('#sendEthAmount').val($('#sendEthAmount').val().replace('/\,/', '/\./'))
        var sendEthAmountNumber = Number($('#sendEthAmount').val())
        if (sendEthAmountNumber > 0 && $('#networkName').val() == 'mainnet') {
            var sendEthAmountFiatUSD = parseFloat($('#inputEthPriceUSD').val() * sendEthAmountNumber).toFixed(2)
            var sendEthAmountFiatRUR = parseFloat($('#inputEthPriceRUR').val() * sendEthAmountNumber).toFixed(2)
            $('#sendEthAmountFiat').text('(' + sendEthAmountFiatUSD + ' USD / ' + sendEthAmountFiatRUR + ' RUR)')
        } else {
            $('#sendEthAmountFiat').text('')
        }

        checkSendEth();
    })


    $('#sendEthMaxAmountLink').mousedown(function () {
        $('#sendEthAmount').val($('#sendEthBalance').text());
    })


    $('#sendEthGasPriceRange').on('input', function () {
        $('#sendEthCommission').text((($('#sendEthGasPriceRange').val() * 21000) / 1e9));
        $('#sendEthButtonSend').show();
        $('#sendEthButtonOk').hide();
        $("#sendEthBalance").text($('#addressBalance').text() - $('#sendEthCommission').text());
        checkSendEth();
    })


    $("#unencryptPrivateKeyRaw").on('input', function () {
        if ($("#unencryptPrivateKeyRaw").val().length == 64 || $("#unencryptPrivateKeyRaw").val().length == 66) {

            addressObj = w3.eth.accounts.privateKeyToAccount($('#unencryptPrivateKeyRaw').val())
            $("#start").hide();
            $("#aboutAddress").show();
            $('.tabs').tabs('updateTabIndicator');
            addressInfo(3);
        }

    })


    window.checkFunctInputs = function (abiObj) {
        $('#callFunctionResult').html('')

        //abiObj = JSON.parse(JSON.stringify(abiObj));
        //window.aabb = abiObj.name
        //abiObj =  JSON.parse(abiObj)
        var emptyInput = 0;


        var myContract = new web3.eth.Contract(JSON.parse(JSON.stringify(JSON.parse($('#contractAbiUser').val()))), $('#contractAddress').val())


        // We don't check inputs, if function == fallback
        if (abiObj.type != 'fallback' && abiObj.inputs) {
            for (var i = 0; i < abiObj.inputs.length; i++) {
                if (!$('#callFunctionParam_' + i).val()) {
                    emptyInput += 1;
                }
            }
        }


        if (abiObj.payable == true) {
            if (!$('#ethValueSmartContract').val()) {
                emptyInput += 1;
            }
            if (parseFloat($('#ethValueSmartContract').val()) > parseFloat($('#addressBalance').text())) {
                $('#smartContractETHAmountError').show();
            } else {
                $('#smartContractETHAmountError').hide();
            }
        }


        if (emptyInput == 0) {

            var params = []
            if (abiObj.type != 'fallback' && abiObj.inputs) {
                for (var i = 0; i < abiObj.inputs.length; i++) {
                    $('#callFunctionParam_' + i).val($('#callFunctionParam_' + i).val().trim())
                    if (abiObj.inputs[i].type.match(/bytes\d\d\[\]/)) {
                        var inputVar = JSON.parse($('#callFunctionParam_' + i).val());
                        for (var ii = 0; ii < inputVar.length; ii++) {
                            if (inputVar[ii].indexOf("0x") == 0) {
                                inputVar[ii] = web3.eth.abi.encodeParameter(abiObj.inputs[i].type.slice(0, -2), inputVar[ii])
                            } else {
                                inputVar[ii] = web3.eth.abi.encodeParameter(abiObj.inputs[i].type.slice(0, -2), web3.utils.asciiToHex(inputVar[ii]))
                            }
                        }
                    } else if (abiObj.inputs[i].type.match(/bytes\d\d/) || abiObj.inputs[i].type.match(/bytes\d/) || abiObj.inputs[i].type.match(/bytes/)) {
                        if ($('#callFunctionParam_' + i).val().indexOf("0x") == 0) {
                            var inputVar = web3.eth.abi.encodeParameter(abiObj.inputs[i].type, $('#callFunctionParam_' + i).val())
                        } else {
                            var inputVar = web3.eth.abi.encodeParameter(abiObj.inputs[i].type, web3.utils.asciiToHex($('#callFunctionParam_' + i).val()))
                        }
                    } else if (abiObj.inputs[i].type == 'string' || abiObj.inputs[i].type == 'address') {
                        if (abiObj.inputs[i].type == 'address') {
                            $('#callFunctionParam_' + i).val(web3.utils.toChecksumAddress($('#callFunctionParam_' + i).val()))
                        }
                        var inputVar = $('#callFunctionParam_' + i).val()

                    } else {

                        var inputVar = JSON.parse($('#callFunctionParam_' + i).val());
                    }

                    params.push(inputVar)
                }
            }


            if (abiObj.stateMutability == 'view' || abiObj.stateMutability == 'pure' || abiObj.constant == true) {
                // view
                myContract.methods[abiObj.name](...params).call(function (error, result) {

                    $('#callFunctionResult').append('<b>' + $('#resultCallFunctionTitle').val() + '</b><span id="smartContractEmptyArraySpan"></span><br>')

                    for (var i = 0; i < abiObj.outputs.length; i++) {

                        var outputName;

                        if (!abiObj.outputs[i].name) {
                            outputName = 'output #' + (i + 1)
                        } else {
                            outputName = abiObj.outputs[i].name
                        }
                        var resultUndefined = false;
                        if (!result) {
                            if (typeof result == 'boolean') {
                                result[i] = 'false';
                                var resultUndefined = false;

                            }
                            else {
                                // typeof result == undefined
                                $('#smartContractEmptyArraySpan').html('<br><font color=red>' + $('#smartContractEmptyArrayText').val() + '</font>');
                                var resultUndefined = true;


                            }


                        }

                        if (resultUndefined == false) {
                            if (abiObj.outputs.length > 1) {
                                $('#callFunctionResult').append(outputName + '<input type=text value="' + result[i] + '">')
                            }
                            else {
                                $('#callFunctionResult').append(outputName + '<input id="test" type=text value="' + result + '">')
                            }
                        } else {

                        }


                    }


                });


            } else {
                // writable function


                if (abiObj.type != 'fallback') {
                    myContract.methods[abiObj.name](...params).estimateGas({
                        from: window.address
                    }, function (error, gasAmount) {
                        if (typeof gasAmount != 'undefined') {
                            $('#smartContractGasAmountInput').val(gasAmount)
                            $('#GasLimitExceedSpan').hide();

                        } else {
                            $('#smartContractGasAmountInput').val(23000)
                            $('#GasLimitExceedSpan').show();

                        }
                    })
                }


            }
        }


    }


    var tokenAbi = JSON.parse('[{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"}]')


    window.showTokenTransferParams = function (tokenContractAddress) {
        if ($('#tokenTransferParamsDiv-' + tokenContractAddress).is(":visible")) {
            $('#tokenTransferParamsDiv-' + tokenContractAddress).hide()
        } else {
            $('#tokenTransferParamsDiv-' + tokenContractAddress).show()
        }
    }


    window.tokenTransferConfirmFunc = function (tokenContractAddress, decimals) {

        tokenAmount = tokenAmountToDecimals($('#tokenTransferInputAmount-' + tokenContractAddress).val(), decimals)
        if (!web3.utils.isAddress($('#tokenTransferInputTo-' + tokenContractAddress).val()) || parseFloat($('#tokenTransferInputAmount-' + tokenContractAddress).val()) == 0 || isNaN(parseFloat($('#tokenTransferInputAmount-' + tokenContractAddress).val()))) {
            $('#transferTokenErrorSpan-' + tokenContractAddress).show()
        } else {
            $('#transferTokenErrorSpan-' + tokenContractAddress).hide()

            var tokenTransferConfirmABI = '[{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"}]'
            var tContract = new web3.eth.Contract(JSON.parse(tokenTransferConfirmABI), tokenContractAddress)


            var sendData = tContract.methods.transfer($('#tokenTransferInputTo-' + tokenContractAddress).val(), tokenAmount).encodeABI()
            var tx = {
                to: tokenContractAddress,
                from: window.address,
                gas: parseInt($('#tokenTransferGasAmount-' + tokenContractAddress).val()),
                nonce: (parseInt($('#tokenTransferNonce-' + tokenContractAddress).val()) > window.nonce) ? parseInt($('#tokenTransferNonce-' + tokenContractAddress).val()) : window.nonce,
                gasPrice: web3.utils.toWei($('#tokenTransferGasPrice-' + tokenContractAddress).val(), "gwei"),
                data: sendData
            }
        }

        $.get("/stat/", {key: "tokenTransfer", value: '', value2: '', address: MD5(window.address)});
        if (connectType == 1) {
            let loaded = false;
            web3.eth.sendTransaction(tx, function (err, transactionHash) {
                if (err) {
                    showToast(err, 'red');

                } else {
                    window.nonce += 1;
                    showToast($('#txSendOk').val(), 'green');
                    $('#txSendOkHash').text(transactionHash)
                    loaded = true;
                }
            });


        } else {
            // other type
            let loaded = false;

            web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
                web3.eth.sendSignedTransaction(signed.rawTransaction)
                    .on('transactionHash', function (hash) {

                        window.nonce += 1;
                        showToast($('#txSendOk').val(), 'green');
                        $('#txSendOkHash').text(hash)
                        loaded = true;
                    })
                    .on('error', function (error) {
                        showToast(error, 'red');

                    })
            });


        }
        $('#tokenTransferInputTo-' + tokenContractAddress).val('')
        $('#tokenTransferInputAmount-' + tokenContractAddress).val('')


    }


    window.tokenShowTransferDiv = function (tokenAddress) {


        for (var i = 0; i < tokenAddressArray.length; i++) {
            if (tokenAddressArray[i] != tokenAddress) {
                $('#transferTokenDiv-' + tokenAddressArray[i]).hide()
                $('#transferTokenButton-' + tokenAddressArray[i]).show()
                $('#tokenExchangeLink-' + tokenAddressArray[i]).show()
            } else {
                $('#transferTokenDiv-' + tokenAddressArray[i]).show()
                $('#transferTokenButton-' + tokenAddressArray[i]).hide()
                $('#tokenExchangeLink-' + tokenAddressArray[i]).hide()
            }
        }


    }


    Number.prototype.toFixedSpecial = function (n) {
        var str = this.toFixed(n);
        if (str.indexOf('e+') < 0)
            return str;

        // if number is in scientific notation, pick (b)ase and (p)ower
        return str.replace('.', '').split('e+').reduce(function (p, b) {
            return p + Array(b - p.length + 2).join(0);
        }) + '.' + Array(n + 1).join(0);
    };

    function tokenAmountToDecimals(a, b) {
        var res = a * (10 ** b);
        return res.toFixedSpecial(0);
    }


    window.estimateGasTokenTransfer = function (tokenContractAddress, decimals) {


        tokenAmount = tokenAmountToDecimals($('#tokenTransferInputAmount-' + tokenContractAddress).val(), decimals)

        var to = $('#tokenTransferInputTo-' + tokenContractAddress).val().toString()

        if (web3.utils.isAddress($('#tokenTransferInputTo-' + tokenContractAddress).val()) && $('#tokenTransferInputAmount-' + tokenContractAddress).val() > 0) {
            var tokenTransferConfirmABI = '[{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"}]'
            var tContract = new web3.eth.Contract(JSON.parse(tokenTransferConfirmABI), tokenContractAddress)
            var sendData = tContract.methods.transfer(to, tokenAmount).encodeABI()

            tContract.methods.transfer(to, tokenAmount).estimateGas({from: window.address})
                .then(function (gasAmount) {
                    $('#tokenTransferGasLimitExceedSpan-' + tokenContractAddress).hide()
                    $('#tokenTransferGasAmount-' + tokenContractAddress).val(gasAmount)

                })
                .catch(function (error) {
                    $('#tokenTransferGasLimitExceedSpan-' + tokenContractAddress).show()
                    console.log('gas amount error - ' + error)
                });
        }


    }

    $('#cardTokenList').append('<a href="#" style="text-decoration:none" onclick="moreTokens()"><span style=color:#01c3b6><span style=font-size:20px;font-weight:500;>' + $('#tokensListCardLabel').val() + ':</span></a>')
    window.showTokenTableCard = false

    function getTokenList() {
        if ($("#networkName").val() === 'mainnet') {
            $.getJSON('https://api.ethplorer.io/getAddressInfo/' + window.address + '?apiKey=freekey')

                .done(function (tokensJson) {
                    if ('tokens' in tokensJson) {
                        $('#tokensTableDiv').show()
                        var tokensValue = []
                        window.tokenAddressArray = []
                        $('#mainTokenDiv').html('<table id=tokenTable class="highlight"><thead><tr><th>' + $('#tokensTableTokenNameText').val() + '</th><th>' + $('#tokensTableBalanceText').val() + '</th><th>' + $('#tokensTablePriceText').val() + ' (USD)</th><th>' + $('#tokensTableSumText').val() + ' (USD)</th><th> </th></tr></thead><tbody>')
                        var allsumtoken = 0
                        window.tokenShowStep = 0
                        for (let tokenData of tokensJson.tokens) {
                            tokenAddressArray.push(tokenData.tokenInfo.address)
                            var tokenContract = new web3.eth.Contract(tokenAbi, tokenData.tokenInfo.address)

                            tokenContract.methods.balanceOf(window.address).call(function (err, result) {

                                if (window.showTokenTableCard == false) {
                                    window.showTokenTableCard = true;
                                    $('#cardTokenList').append('<table id=tokenTableCard class="highlight"><thead><tr><th>' + $('#tokensTableTokenNameText').val() + '</th><th>' + $('#tokensTableBalanceText').val() + '</th><th>' + $('#tokensTablePriceText').val() + ' (USD)</th><th>' + $('#tokensTableSumText').val() + ' (USD)</th></tr></thead><tbody></table><br><a href="javascript:moreTokens()" style="text-decoration:none"><span style=color:#01c3b6>' + $('#tokenListCardLabelMore').val() + '</span></a>')
                                }

                                var tokenBalance = parseFloat(result) / parseInt('1' + '0'.repeat(parseInt(tokenData.tokenInfo.decimals)));

                                if (err || isNaN(tokenBalance)) {
                                    tokenBalance = parseFloat(tokenData.balance)
                                        / parseInt('1' + '0'.repeat(parseInt(tokenData.tokenInfo.decimals)));
                                }

                                if (typeof (tokenData.tokenInfo.price) == 'object') {
                                    tokenPrice = parseFloat(tokenData.tokenInfo.price.rate).toFixed(2)
                                    totaltokenPrice = (tokenPrice * parseFloat(tokenBalance)).toFixed(2)
                                    allsumtoken += totaltokenPrice
                                } else {
                                    tokenPrice = ' - '
                                    totaltokenPrice = ' - '
                                }

                                $('#tokenTable').append('<tr><td>' + tokenData.tokenInfo.name + '</td><td>' + tokenBalance + '</td><td>' + tokenPrice + '</td><td>' + totaltokenPrice + '</td><td><div id="transferTokenDiv-' +

                                    tokenData.tokenInfo.address + '" style=display:none>' + ' <div class="input-wrap"> <div class="form-group">' + $('#tokensTableTransferToText').val() +

                                    '<input type=text oninput="estimateGasTokenTransfer(\'' + tokenData.tokenInfo.address + '\', ' + tokenData.tokenInfo.decimals + ')" id=tokenTransferInputTo-' + tokenData.tokenInfo.address + '></div><div class=" form-group">' + $('#tokensTableTransferAmountText').val() +
                                    ' <input type=number oninput="estimateGasTokenTransfer(\'' + tokenData.tokenInfo.address + '\', ' + tokenData.tokenInfo.decimals + ')" id=tokenTransferInputAmount-' + tokenData.tokenInfo.address + '>' +
                                    '</div>  <div class="form-group flex-center">  <br><span style="display:none;color:red;" id=transferTokenErrorSpan-'
                                    + tokenData.tokenInfo.address + '>' + $('#tokensTableTransferErrorText').val() + '</span>' +
                                    '<span style="display:none;color:red;" id=tokenTransferGasLimitExceedSpan-' + tokenData.tokenInfo.address + '>' + $('#TokenTransferGasLimitExceedText').val() + '</span>'
                                    + '<img onclick=showTokenTransferParams("' + tokenData.tokenInfo.address + '") style="width:30px; margin-right:10px;" ' +
                                    'src=/assets/img/settingsImg.png><button onclick="tokenTransferConfirmFunc(\'' + tokenData.tokenInfo.address + '\', ' + tokenData.tokenInfo.decimals + ')" ' +
                                    'id=transferTokenConfirm-' + tokenData.tokenInfo.address + ' type="button" class="btn waves-effect waves-light">'
                                    + $('#tokensTableTransferConfirmButtonText').val() + '</button></div> </div>      </div>  <button onclick=tokenShowTransferDiv("'
                                    + tokenData.tokenInfo.address + '") id=transferTokenButton-' + tokenData.tokenInfo.address + ' type="button" ' +
                                    'class="btn waves-effect waves-light">' + $('#tokensTableButtonTransferText').val() + '</button>' +
                                    '<a id=tokenExchangeLink-' + tokenData.tokenInfo.address + ' target=_blank href="https://etherdelta.com/#' + tokenData.tokenInfo.symbol
                                    + '-ETH"><button type="button" class="btn waves-effect waves-purple">' + $('#tokensTableButtonExchangeText').val() + '</button></a>'
                                    + '</td></tr>');


                                $('#transferTokenDiv-' + tokenData.tokenInfo.address).after('<div class="transferTokenDiv" id=tokenTransferParamsDiv-' + tokenData.tokenInfo.address + ' ' +
                                    'style="display:none" > <div class="transferTokenChild"> Gas Amount <br><input style="width: 86px;" id=tokenTransferGasAmount-' + tokenData.tokenInfo.address + ' ' +
                                    'type=number value=60000></div> <div class="transferTokenChild">Gas Price (Gwei)<br><input style="width: 110px;" value=' + $('#inputGasPriceAverage').val() + ' id=tokenTransferGasPrice-'
                                    + tokenData.tokenInfo.address + ' type=number></div> <div class="transferTokenChild">Nonce<br><input style="width: 50px;" id=tokenTransferNonce-' + tokenData.tokenInfo.address + '  ' +
                                    'value=' + window.nonce + ' type=number></div></div>');

                                if (window.tokenShowStep == 0) {
                                    $('#tokenTableCard').append('<tr><td>' + tokenData.tokenInfo.name + '</td><td>' + tokenBalance + '</td><td>' + tokenPrice + '</td><td>' + totaltokenPrice + '</td></tr>')

                                }
                                if (window.tokenShowStep == 1) {
                                    $('#tokenTableCard').append('<tr><td>' + tokenData.tokenInfo.name + '</td><td>' + tokenBalance + '</td><td>' + tokenPrice + '</td><td>' + totaltokenPrice + '</td></tr>')

                                }

                                if (window.tokenShowStep == 2) {
                                    $('#tokenTableCard').append('<tr><td>' + tokenData.tokenInfo.name + '</td><td>' + tokenBalance + '</td><td>' + tokenPrice + '</td><td>' + totaltokenPrice + '</td></tr>')

                                }

                                window.tokenShowStep++;

                            })

                        }

                        $('#mainTokenDiv').append('</tbody></table>')
                    } else {
                        $('#noTokensWarning').show()
                        $('#cardTokenList').append('<br><center>' + $('#noTokensWarningCard').val() + '</center>')
                    }


                })
        } else if ($("#networkName").val() !== 'mainnet') {
            $('#mainTokenDiv').html('<center><b>' + $('#tokensTableNotLoadText').val() + '</b></center>')
            $('#cardTokenList').html('');
            $('#cardTokenList').append('<a href=# style="text-decoration:none" onclick="moreTokens()"><span style=color:#01c3b6;font-size:20px;font-weight:500;>' + $('#tokensListCardLabel').val() + ':</span></a>')
            $('#cardTokenList').append('<br><center>' + $('#tokensTableNotLoadText').val() + '</center>')
        }
    }


    window.getTransactionsByAccount = function () {


        var time = Math.round(new Date().getTime() / 1000)
        $.getJSON('/getTransactions/?address=' + window.address + '&network=' + $('#networkName').val())
            .done(function (transactionsdata) {
                $('#transactionsLoading').hide()
                $('#transactionsLis').html('')
                $('#cardTxList').html('')


                if (transactionsdata['status'] == 0) {
                    $('#transactionsLis').html('<center>' + $('#txListEmpty').val() + '</center>')

                    $('#cardTxList').append('<a href=# style="text-decoration:none"><span style=color:#01c3b6><span style=font-size:20px;font-weight:500;>' + $('#txListCardLabel').val() + ':</span></a>')
                    $('#cardTxList').append('<br><br><center>' + $('#txListEmpty').val() + '</center>')

                } else {
                    $('#transactionsLoading').hide()
                    $('#transactionsLis').append('<table id=txtable class="highlight" style=margin-left:50px;margin-right:50px;><thead><tr><th style="padding-left: 135px">' + $('#txListCardLabelDate').val() + '</th><th>' + $('#txListCardLabelAmount').val() + '</th><th>' + $('#txListCardLabelFrom').val() + '</th><th>' + $('#txListCardLabelTo').val() + '</th></thead>')
                    var txC = 0;
                    var txarr = []

                    for (let transaction of transactionsdata.result) {
                        if (!txarr.includes(transaction['hash'])) {
                            txarr.push(transaction['hash'])

                            var txType = '';
                            if (parseInt(transaction['value']) > 0) {
                                if (transaction['from'] == transaction['to']) {
                                    txType = '<font color=grey><b>< - ></b></font>'
                                } else if (transaction['from'].toUpperCase() == window.address.toUpperCase()) {
                                    txType = '<font color=red><b>-</b></font>'
                                } else {
                                    txType = '<font color=green><b>+</b></font>'
                                }
                            }

                            var txBgColor
                            if (transaction['isError'] != 0) {
                                txBgcolor = '#F4A460'
                            } else {
                                txBgcolor = '#ffffff'
                            }
                            if (transaction['contractAddress']) {
                                let contractAddress = transaction["contractAddress"];
                                var transactionTo = $('#txCreateContract').val() + ' - <a href="#" onclick="contractMore(\'' + contractAddress + '\')">'
                                    + transaction['contractAddress'] + '</a>';
                                var transactionToInfoTab = $('#txCreateContract').val() +
                                    ' - <a href="#" onclick="contractMore(\'' + contractAddress + '\')">' + transaction['contractAddress'].substr(0, 17) + '...'
                                    + '</a>';
                            } else if (transaction['input'] != '0x' && transaction['input'] != '0x00') {
                                let contractAddress = transaction['to'];
                                var transactionTo = $('#txCallFunc').val()
                                    + ' <a href="#" onclick="contractMore(\'' + contractAddress + '\')">' + contractAddress
                                    + '</a>';
                                var transactionToInfoTab = $('#txCallFunc').val()
                                    + ' <a href="#" onclick="contractMore(\'' + contractAddress + '\')">' + contractAddress.substr(0, 17) + '...'
                                    + '</a>';
                            } else {
                                var transactionTo = transaction['to']
                                var transactionToInfoTab = transaction['to'].substr(0, 17) + '...'
                            }

                            if (time - transaction['timeStamp'] < 60) {
                                var txTime = time - transaction['timeStamp'] + ' ' + $('#txListSec').val()
                            } else if (time - transaction['timeStamp'] < 3600) {
                                var txTime = Math.round(parseInt(time - transaction['timeStamp']) / 60) + ' ' + $('#txListMins').val()
                            } else {
                                //var txhours =Math.floor(txminutes / 60)

                                var txminutes = Math.floor(parseInt(time - transaction['timeStamp']) / 60)

                                var txhours = Math.floor(txminutes / 60)

                                var txminutes2 = Math.floor((parseInt(time - transaction['timeStamp']) - (txhours * 3600)) / 60)
                                if (txhours < 24) {
                                    var txTime = txhours + ' ' + $('#txListHours2').val() + ' ' + txminutes2 + ' ' + $('#txListMins').val()
                                } else {
                                    var date = new Date(parseInt(transaction['timeStamp']) * 1000)
                                    var mins = parseInt(date.getMinutes()) < 10 ? '0' + date.getMinutes() : date.getMinutes()
                                    var hrsz = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours()
                                    var txTime = hrsz + ':' + mins + ' &nbsp;&nbsp;&nbsp;' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear().toString().slice(2, 4)
                                }
                            }
                            $('#txtable').append('<tr bgcolor=' + txBgcolor + '><td style=align:right>' + txTime + '</td><td>' + txType + ' ' + parseInt(transaction['value']) / 1e18 + ' ETH</td><td>' + transaction['from'] + '</td><td>' + transactionTo + '</td></tr>')
                            if (txC < 6) {
                                if (txC == 0) {
                                    $('#cardTxList').append('<a href=# style="text-decoration:none" onclick="moreTransactions()"><span style=color:#01c3b6><span style=font-size:20px;font-weight:500;>' + $('#txListCardLabel').val() + ':</span></a>')
                                    $('#cardTxList').append('<table id=txtableTab class="highlight"><thead><tr><th align=right>' + $('#txListCardLabelDate').val() + '</th><th>' + $('#txListCardLabelAmount').val() + '</th><th>' + $('#txListCardLabelFrom').val() + '</th><th>' + $('#txListCardLabelTo').val() + '</th></thead>')
                                }
                                $('#txtableTab').append('<tr bgcolor=' + txBgcolor + '><td style=align:right>' + txTime + '</td><td>' + txType + ' ' + parseInt(transaction['value']) / 1e18 + ' ETH</td><td title="' + transaction['from'] + '">' + transaction['from'].substr(0, 17) + '...' + '</td><td title="' + transaction['to'] + transaction['contractAddress'] + '">' + transactionToInfoTab + '</td></tr>')

                            }
                            if (txC == 0) {
                                $('#cardTxList').append('</table>')
                                $('#cardTxList').append('<a class="tx-more-link" href="#" style="text-decoration:none" onclick="moreTransactions()"><span style=color:#01c3b6>' + $('#txListCardLabelMore').val() + '</span></a>');
                            }
                            txC++;


                        }
                    }

                    $('#txtable').append('</table>')
                }


            })
            .fail(function (data) {
                $('#transactionsLoading').hide()
                $('#transactionsErrorDiv').show()
            })
    }


    window.useContractCallFunction = function (abiObj) {

        abiObj = JSON.parse(JSON.stringify(abiObj));
        var params = []


        if (abiObj.stateMutability == 'view' || abiObj.stateMutability == 'pure' || abiObj.constant == true) {
            var isView = true

        } else {
            var isView = false
            if (abiObj.payable == true) {
                var isPayable = "need pay eth"
            } else {
                var isPayable = "no pay"
            }
        }


        if (abiObj.type != 'fallback') {
            for (var i = 0; i < abiObj.inputs.length; i++) {
                $('#callFunctionParam_' + i).val($('#callFunctionParam_' + i).val().trim())
                if (abiObj.inputs[i].type.match(/bytes\d\d\[\]/)) {
                    var inputVar = JSON.parse($('#callFunctionParam_' + i).val());
                    for (var ii = 0; ii < inputVar.length; ii++) {
                        if (inputVar[ii].indexOf("0x") == 0) {
                            inputVar[ii] = web3.eth.abi.encodeParameter(abiObj.inputs[i].type.slice(0, -2), inputVar[ii])
                        } else {
                            inputVar[ii] = web3.eth.abi.encodeParameter(abiObj.inputs[i].type.slice(0, -2), web3.utils.asciiToHex(inputVar[ii]))
                        }
                    }
                } else if (abiObj.inputs[i].type.match(/bytes\d\d/) || abiObj.inputs[i].type.match(/bytes\d/)) {
                    if ($('#callFunctionParam_' + i).val().indexOf("0x") == 0) {
                        var inputVar = web3.eth.abi.encodeParameter(abiObj.inputs[i].type, $('#callFunctionParam_' + i).val())
                    } else {
                        var inputVar = web3.eth.abi.encodeParameter(abiObj.inputs[i].type, web3.utils.asciiToHex($('#callFunctionParam_' + i).val()))
                    }
                } else if (abiObj.inputs[i].type == 'string' || abiObj.inputs[i].type == 'address') {
                    if (abiObj.inputs[i].type == 'address') {
                        $('#callFunctionParam_' + i).val(web3.utils.toChecksumAddress($('#callFunctionParam_' + i).val()))
                    }
                    var inputVar = $('#callFunctionParam_' + i).val()

                } else {

                    var inputVar = JSON.parse($('#callFunctionParam_' + i).val());
                }

                params.push(inputVar)

            }
        }


        var myContract = new web3.eth.Contract(JSON.parse($('#contractAbiUser').val()), $('#contractAddress').val())
        if (isView) {

        } else {
            // make tx
            if (abiObj.type != 'fallback') {
                var sendData = myContract.methods[abiObj.name](...params).encodeABI()
                var tx = {
                    to: $('#contractAddress').val(),
                    from: window.address,
                    gas: $('#smartContractGasAmountInput').val(),
                    nonce: ($('#smartContractNonceInput').val() < window.nonce) ? window.nonce : $('#smartContractNonceInput').val(),
                    gasPrice: web3.utils.toWei($('#smartContractGasPriceInput').val(), "gwei"),
                    data: sendData
                }
                if (abiObj.payable == true) {
                    tx['value'] = web3.utils.toWei($('#ethValueSmartContract').val(), "ether")
                }
                if (connectType == 1) {
                    let loaded = false;
                    myContract.methods[abiObj.name](...params).estimateGas({
                        from: window.address
                    }, function (error, gasAmount) {

                        web3.eth.sendTransaction(tx, function (err, transactionHash) {
                            if (err) {
                                showToast(err, 'red');

                            } else {
                                window.nonce += 1;
                                showToast($('#txSendOk').val(), 'green');
                                $('#txSendOkHash').text(transactionHash)
                                loaded = true;
                            }

                        });

                    })
                    var timerId = setInterval(function () {
                        copyToClipboard('#txSendOkHash');
                        if (loaded)
                            clearTimeout(timerId);
                    }, 1000)
                } else {
                    // other type
                    let loaded = false;

                    web3.eth.accounts.signTransaction(tx, window.privateKey).then(signed => {
                        web3.eth.sendSignedTransaction(signed.rawTransaction)
                            .on('transactionHash', function (hash) {
                                window.nonce += 1;
                                showToast($('#txSendOk').val(), 'green');
                                $('#txSendOkHash').text(hash)
                                loaded = true;
                            })
                            .on('error', function (error) {
                                showToast(error, 'red');

                            })
                    });
                    var timerId = setInterval(function () {
                        copyToClipboard('#txSendOkHash');
                        if (loaded)
                            clearTimeout(timerId);
                    }, 1000)

                }


            } else {
                // make tx for fallback
                var tx = {
                    from: window.address,
                    to: $('#contractAddress').val(),
                    nonce: ($('#smartContractNonceInput').val() < window.nonce) ? window.nonce : $('#smartContractNonceInput').val(),
                    gasPrice: web3.utils.toWei($('#smartContractGasPriceInput').val(), "gwei"),
                    gas: $('#smartContractGasAmountInput').val()
                }
                if (abiObj.payable == true) {
                    tx['value'] = web3.utils.toWei($('#ethValueSmartContract').val(), "ether")
                }
                if (connectType == 1) {
                    //Metamask
                    let loaded = false;
                    web3.eth.sendTransaction(tx, function (err, transactionHash) {
                        if (err) {
                            showToast(err, 'red');

                        } else {
                            window.nonce += 1;
                            showToast($('#txSendOk').val(), 'green');
                            $('#txSendOkHash').text(transactionHash)
                            loaded = true;
                        }
                    });

                    var timerId = setInterval(function () {
                        copyToClipboard('#txSendOkHash');
                        if (loaded)
                            clearTimeout(timerId);
                    }, 1000)

                } else {
                    // Other type
                    // sign and after it send raw tx to infura
                    let loaded = false;

                    web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
                        web3.eth.sendSignedTransaction(signed.rawTransaction)
                            .on('transactionHash', function (hash) {

                                window.nonce += 1;
                                showToast($('#txSendOk').val(), 'green');
                                $('#txSendOkHash').text(hash)
                                loaded = true;
                            })
                            .on('error', function (error) {
                                showToast(error, 'red');

                            })
                    });

                    var timerId = setInterval(function () {
                        copyToClipboard('#txSendOkHash');
                        if (loaded)
                            clearTimeout(timerId);
                    }, 1000)
                }
            }

        }

    }


    window.ParamsLinkSmartContractFunc = function () {

        if ($("#smartContractParamsDiv").is(":visible") == true) {
            $("#smartContractParamsDiv").hide();
            $("#smartContractImgParams").attr("src", "/assets/img/linedown.png");
        } else {
            $("#smartContractParamsDiv").show();
            $("#smartContractImgParams").attr("src", "/assets/img/lineup.png");
        }

    }


    window.showContractFunctionInterface = function (abiObj) {
        $('#GasLimitExceedSpan').hide();
        $('#callFunctionResult').html('');
        $("#smartContractImgParams").attr("src", "/assets/img/linedown.png");
        abiObj = JSON.parse(JSON.stringify(abiObj));
        $('#useContractInputs').html('');

        $('#smartContractGasAmountInput').val(23000)


        if ($("#smartContractParamsDiv").is(":visible") == true) {
            $("#smartContractParamsDiv").hide();
            $("#smartContractImgParams").attr("src", "/assets/img/linedown.png");
        }


        if (abiObj.stateMutability == 'view' || abiObj.stateMutability == 'pure' || abiObj.constant == true) {
            var isView = true
            $('#ParamsLinkSmartContract').hide();
            $('#smartContractParamsDiv').hide();
        } else {
            var isView = false
            $('#ParamsLinkSmartContract').show();
            if (abiObj.payable == true) {
                var isPayable = "need pay eth"
            } else {
                var isPayable = "no pay"
            }
        }


        if (abiObj.type == 'fallback') {
            $('#useContractFunctionName').text('Fallback function');
        } else {
            $('#useContractFunctionName').text(abiObj.name);
        }


        if (abiObj.type != 'fallback') {
            for (var i = 0; i < abiObj.inputs.length; i++) {
                var isMapping = false
                if (abiObj.inputs[i].name == '') {
                    if (isMapping == false) {
                        //var inputName = '<i>MAPPING</i>'
                        var inputName = 'Input #' + (i + 1)
                        isMapping = true
                    } else {
                        var inputName = ''
                    }
                } else {
                    var inputName = abiObj.inputs[i].name
                }
                $('#useContractInputs').append('<font size=3>' + inputName + '<br><input oninput=window.checkFunctInputs(' + JSON.stringify(abiObj) + ') id="callFunctionParam_' + i + '" type=text placeholder=' + abiObj.inputs[i].type + '><br>')
            }

        }


        if (abiObj.payable == true) {

            $('#useContractInputs').append('<font size=3>ETH Amount <span id=smartContractETHAmountError><font color=red>' + $('#smartContractEthAmountErrorText').val() + '</font></span><br><input oninput=window.checkFunctInputs(' + JSON.stringify(abiObj) + ') id="ethValueSmartContract" type=text><br>')
        }
        if (!isView) {

            if (!abiObj.hasOwnProperty('inputs')) {

                window.checkFunctInputs(abiObj);
            }
            $('#callFunctionButtonDiv').html('<button class="btn" id="useContractCallFunction" onmousedown=window.useContractCallFunction(' + JSON.stringify(abiObj) + ')>' + $('#CallSmartContractFuncText').val() + '</button>')
            //estimage gas
            var myContract = new web3.eth.Contract(JSON.parse(JSON.stringify(JSON.parse($('#contractAbiUser').val()))), $('#contractAddress').val())

            myContract.methods[abiObj.name]().estimateGas({
                from: window.address
            }, function (error, gasAmount) {
                if (typeof gasAmount != 'undefined') {
                    $('#smartContractGasAmountInput').val(gasAmount)
                    $('#GasLimitExceedSpan').hide();

                } else {
                    $('#smartContractGasAmountInput').val(23000)
                    $('#GasLimitExceedSpan').show();

                }
            })


        } else {
            $('#callFunctionButtonDiv').html('');
        }
    }

    function loadContractInterface(abidata) {
        if (typeof abidata == 'string') {
            abidata = JSON.parse(abidata)

        }

        $('#contractPublicInfo').append('<b>' + $('#translate-ContractBalance').val() + '</b> - <span id=ContractBalance></span>')
        web3.eth.getBalance($('#contractAddress').val(), function (error, balance) {
            balance = parseFloat(web3.utils.fromWei(balance)).toFixed(2)
            if (balance > 0 && $("#networkName").val() == 'mainnet') {
                balance += ' ETH (' + parseFloat($('#inputEthPriceUSD').val() * balance).toFixed(2) + ' USD)<hr>'
            } else {
                balance += ' ETH<hr>'
            }
            $('#ContractBalance').html(balance);
        })
        $('#contractAbiUser').val(JSON.stringify(abidata));
        $('#contractAbiUser').hide();
        $('#contractRefreshInfo').show();

        let abi = JSON.parse(JSON.stringify(abidata));


        var ethContract = new web3.eth.Contract(abi, $('#contractAddress').val())

        $('#contractPublicFunctions').append('<b>' + $('#ReadFunctionTitile').val() + '</b><hr>')
        $('#contractPayFunctions').append('<b>' + $('#WriteFUnctionTitle').val() + '</b><hr>')

        for (let item of abi) {
            if (item.type == 'function') {

                if (item.stateMutability == 'view' || item.stateMutability == 'pure' || item.constant == true) {

                    if (item.inputs.length == 0) {

                        ethContract.methods[item.name]().call(function (err, result) {
                            if (typeof result === 'object') {
                                for (var i = 0; i < item.outputs.length; i++) {
                                    if (!item.outputs[i].name) {
                                        item.outputs[i].name = i;
                                    }
                                    $('#contractPublicInfo').append('<b>' + item.name + '[' + item.outputs[i].name + ']</b> - ' + result[i] + '<br>');
                                }
                            } else {
                                $('#contractPublicInfo').append('<b>' + item.name + '</b> - ' + result + '<br>');
                            }
                        })
                    } else {


                        $('#contractPublicFunctions').append('<button type="button" class="btn" onmousedown=window.showContractFunctionInterface(' + JSON.stringify(item) + ')>' + item.name + '<i class="material-icons right">send</i></button><br>')
                    }
                }
                // writanle
                else {

                    $('#contractPayFunctions').append('<button type="button" class="btn" onmousedown=window.showContractFunctionInterface(' + JSON.stringify(item) + ')>' + item.name + '<i class="material-icons right">send</i></button><br>')
                }
            } else if (item.type == 'fallback') {

                $('#contractPayFunctions').append('<button type="button" class="btn" onmousedown=window.showContractFunctionInterface(' + JSON.stringify(item) + ')>Fallback function<i class="material-icons right">send</i></button><br>')

            }
        }


    }


    $('#contractRefreshInfo').mousedown(function () {
        $('#contractPublicInfo').html('');
        $('#contractPublicFunctions').html('')
        $('#contractPayFunctions').html('')
        loadContractInterface($('#contractAbiUser').val())


    })


    $('#contractAbiUser').on('input', function () {
        try {
            var abi = $.parseJSON($('#contractAbiUser').val());
            $('#contractAbiDiv').hide()
            loadContractInterface(abi);
        } catch (err) {
            console.log('User abi json error - ' + err)
        }
    })


    $('#contractAddress').on('input', (function () {
        $('#contractAddress').val($('#contractAddress').val().replace(/\s/g, ''))
        $('#contractPublicInfo').html('');
        $('#contractPublicFunctions').html('')
        $('#contractPayFunctions').html('')
        $('#contractRefreshInfo').hide();
        $('#useContractInputs').html('');
        $('#useContractFunctionName').html('');
        $('#callFunctionButtonDiv').html('');
        $('#ParamsLinkSmartContract').hide();
        $('#smartContractParamsDiv').hide();
        $('#contractAbiDiv').hide();
        $('#contractAbiUser').hide();
        $('#contractAbiUser').val('');
        $('#callFunctionResult').html('')
        if (w3.utils.isAddress($('#contractAddress').val().replace(/\s/g, '')) == true) {

            if ($('#networkName').val() != 'mainnet') {
                apiNetworkName = '-' + $('#networkName').val();
            } else {
                apiNetworkName = '';
            }


            $.getJSON('https://api' + apiNetworkName + '.etherscan.io/api?module=contract&action=getabi&address=' + $('#contractAddress').val().replace(/\s/g, '') + '&format=raw')
                .done(function (data) {
                    try {
                        $.get("/stat/", {key: "contractLoad", value: '1', value2: '', address: MD5(window.address)});
                        $('#contractAbiUser').val(data)
                        loadContractInterface(data);
                    } catch (err) {

                        alert('Incorrect address');
                    }
                })
                .fail(function (jqxhr, textStatus, error) {
                    $.get("/stat/", {key: "contractLoad", value: '2', value2: '', address: MD5(window.address)});
                    $('#contractAbiDiv').show();
                    $('#contractAbiUser').show();
                    $('#contractAbiUser').val('');

                    var err = textStatus + ", " + error;
                    console.log("Request Failed: " + err);
                });

        } else {

        }
    }))


    $('#sendEthButtonSend').mousedown(function () {
        $('#sendEthButtonSend').hide();
        $('#sendEthButtonOk').show();
    })


    $("#walletTypeMetamask").mousedown(async function () {
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                $("#start").hide();
                $("#aboutAddress").show();

                $('.tabs').tabs('updateTabIndicator');
                addressInfo(1);
            } catch (error) {
                // User denied account access...
                $('#metamaskBlockWarning').show();
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            $("#start").hide();
            $("#aboutAddress").show();
            $('.tabs').tabs('updateTabIndicator');
            addressInfo(1);
        }
        // Non-dapp browsers...
        else {
            $('#metamaskInstall').show();

        }
    });


    function getGasPricaData() {


        if ($('#inputGasPriceFast').val() != 9999) {


            $('#sendEthGasPriceRange').attr('max', parseFloat($('#inputGasPriceFast').val()) + 15);


            var average = $('#inputGasPriceAverage').val()
            $('#smartContractGasPriceInput').val(Math.ceil(average));

            $('#sendEthGasPriceRange').val(average);
            $('#inputGasPriceFast').val($('#inputGasPriceFast').val() + 15)
            $('#sendEthGasPriceGWEI').val(average + " GWEI");
            $('#sendEthCommission').text(((average * parseInt($('#sendEthGasAmount').val())) / 1e9));

        } else {

            web3.eth.getGasPrice()
                .then((gprice) => {
                    gweiGasPrice = (gprice / 1e9) * 2
                    $('#sendEthGasPriceRange').val(gweiGasPrice);
                    $('#smartContractGasPriceInput').val(gweiGasPrice);
                    $('#sendEthGasPriceGWEI').val(gweiGasPrice + " GWEI");
                    $('#sendEthCommission').text(((gweiGasPrice * parseInt($('#sendEthGasAmount').val())) / 1e9));
                    $('#inputGasPriceAverage').val(gweiGasPrice)
                });
        }


        $("#sendEthBalance").text($('#addressBalance').text() - $('#sendEthCommission').text());
    }

    function getBalancePeriod() {

        web3.eth.getBalance($('#address').text(), function (error, balance) {
            if (balance === null) {
                getBalancePeriod()
            }
            else {

                $('#addressBalance').text(web3.utils.fromWei(balance.toString()));
                if (Number($('#addressBalance').text()) > 0) {


                    $('#sendEthAddParamsLink').css('display', 'inline');
                    $('#cardSendEthAddress').removeAttr('disabled');
                    $('#cardSendEthAmount').removeAttr('disabled');
                    $('#cardSendEthButtonSend').removeAttr('disabled');
                }
                else {
                    $('#cardSendEthButtonSend').attr('disabled', 'disabled');
                    $('#cardSendEthAddress').attr('disabled', 'disabled');
                    $('#cardSendEthAmount').attr('disabled', 'disabled');
                    $('#sendEthAddParamsLink').css('display', 'none');
                }
                if ($("#networkName").val() == 'mainnet') {
                    balanceFiatValue();
                }
                else {
                    $('#USDLabel').css('visibility', 'hidden');
                }
                $("#sendEthBalance").text($('#addressBalance').text() - $('#sendEthCommission').text());

            }
        })
    }


    window.nonce = 0;

    function getNoncePeriod() {
        web3.eth.getTransactionCount(window.address, "pending").then(txCount => {
            if (txCount > window.nonce) {
                window.nonce = txCount;
            }
            if ($('#sendEthNonceInput').val() < window.nonce) {
                $('#sendEthNonceInput').val(window.nonce);
            }
            else if ($('#sendEthNonceInput').val().length < 1) {
                $('#sendEthNonceInput').val(window.nonce);
            }

            if ($('#smartContractNonceInput').val() < window.nonce) {
                $('#smartContractNonceInput').val(window.nonce);
            }
            else if ($('#smartContractNonceInput').val().length < 1) {
                $('#smartContractNonceInput').val(window.nonce);
            }


            if ($('#networkName').val() == 'mainnet' && typeof tokenAddressArray !== 'undefined') {
                for (var i = 0; i < tokenAddressArray.length; i++) {
                    if ($('#tokenTransferNonce-' + tokenAddressArray[i]).val() < window.nonce) {
                        $('#tokenTransferNonce-' + tokenAddressArray[i]).val(window.nonce);
                    }
                    else if ($('#tokenTransferNonce-' + tokenAddressArray[i]).val().length < 1) {
                        $('#tokenTransferNonce-' + tokenAddressArray[i]).val(window.nonce);
                    }
                }
            }
        })
    }


    function loopGetTransactions() {
        getTransactionsByAccount();                                        // change to a random image
        var rand = Math.floor(Math.random() * (21000 - 15000)) + 15000  // get a number between 2 and 7 (5 + 2) seconds (you can change to whatever meets your need)
        setTimeout(loopGetTransactions, rand);                               // call loop after that amount of time is passed
    }


    function load() {
        $.get("/stat/", {
            key: "authType",
            value: window.connectType,
            value2: $("#networkName").val(),
            address: MD5(window.address)
        });
        setInterval(getBalancePeriod, 15000);
        setInterval(getNoncePeriod, 5000);
        loopGetTransactions();
        getGasPricaData();
        getTokenList();
        getNoncePeriod();
        if ($("#networkName").val() == 'mainnet') {
            $("#buttonMerchantServices").css('display', 'inline');
            $("#buttonPopUp").css('display', 'none');
        }
        else {
            $("#buttonMerchantServices").css('display', 'none');
            $("#buttonPopUp").css("display", "inline");
        }
        //getTransactionsByAccount()
        if (connectType != 1) {
            $('#buttonShowPrivateKey').css('display', 'inline');
            $('#buttonShowPrivateKey').mousedown(function () {
                $('#privateKeyRAW').text(privateKey.substr(2))
                $('#privateKeyLine').show()
                $('#buttonShowPrivateKey').hide()
                $('#buttonHidePrivateKey').css('display', 'inline');
            })

            $('#buttonHidePrivateKey').mousedown(function () {
                $('#privateKeyLine').hide()
                $('#buttonShowPrivateKey').css('display', 'inline');
                $('#buttonHidePrivateKey').hide()
            })
        }
        $('#address').text(address);

        getBalancePeriod()


    }


    $('#buttonDownloadUTC').mousedown(function () {
        var passwordForDownloadUTC = prompt($('#CreateWalletDesc').val(), '');
        const accounts = new Accounts();
        const accountObject = accounts.new();
        var j = w3.eth.accounts.encrypt(window.privateKey, passwordForDownloadUTC);
        var d = new Date();
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(j)));
        element.setAttribute('download', 'UTC--' + d.toISOString().replace(/:/g, '-') + '--' + accountObject.address);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    })

    $('#sendEthButtonOk').click(function (e) {
        $.get("/stat/", {key: "sendETH", value: '', value2: '', address: MD5(window.address)});

        var tx = {
            from: $('#address').text(),
            to: $('#sendEthAddress').val(),
            nonce: ($('#sendEthNonceInput').val() < window.nonce) ? window.nonce : $('#sendEthNonceInput').val(),
            value: web3.utils.toWei($('#sendEthAmount').val(), "ether"),
            gasPrice: web3.utils.toWei($('#sendEthGasPriceRange').val(), "gwei"),
            gas: $('#sendEthGasAmount').val()
        }
        if (connectType == 1) {
            //Metamask
            let loaded = false;

            web3.eth.sendTransaction(tx, function (err, transactionHash) {
                if (err) {
                    showToast(err, 'red');

                } else {
                    $('#cardSendEthAddress').val('')
                    $('#cardSendEthAmount').val('')
                    $('#sendEthAddress').val('')
                    $('#sendEthAmount').val('')
                    $('#cardSendEthButtonOk').hide()
                    $('#cardSendEthButtonSend').show()
                    $('#sendEthButtonOk').hide()
                    $('#sendEthButtonSend').show()
                    $('#sendEthButtonSend').attr('disabled', 'disabled');
                    window.nonce += 1;
                    showToast($('#txSendOk').val(), 'green');
                    $('#txSendOkHash').text(transactionHash)
                    loaded = true;

                }
            });

            var timerId = setInterval(function () {
                copyToClipboard('#txSendOkHash');
                if (loaded)
                    clearTimeout(timerId);
            }, 1000)
        } else {
            // Other type
            // sign and after it send raw tx to infura

            let loaded = false;

            web3.eth.accounts.signTransaction(tx, window.privateKey).then(signed => {
                web3.eth.sendSignedTransaction(signed.rawTransaction)
                    .on('transactionHash', function (hash) {
                        $('#cardSendEthAddress').val('')
                        $('#cardSendEthAmount').val('')
                        $('#sendEthAddress').val('')
                        $('#sendEthAmount').val('')
                        $('#cardSendEthButtonOk').hide()
                        $('#cardSendEthButtonSend').show()
                        $('#sendEthButtonOk').hide()
                        $('#sendEthButtonSend').show()
                        $('#sendEthButtonSend').attr('disabled', 'disabled');

                        window.nonce += 1;
                        showToast($('#txSendOk').val(), 'green');
                        $('#txSendOkHash').text(hash);
                        loaded = true;
                    }).on('error', function (error) {
                    showToast(error, 'red');
                });
            });

            var timerId = setInterval(function () {
                copyToClipboard('#txSendOkHash');
                if (loaded)
                    clearTimeout(timerId);
            }, 1000)
        }
    })

    function balanceFiatValue() {

        $('#balanceFiat').css("display", "inline");


        $('#balanceFiatUSD').text(($('#inputEthPriceUSD').val() * $('#addressBalance').text()).toFixed(2));

        $('#balanceFiatRUR').text(($('#inputEthPriceRUR').val() * $('#addressBalance').text()).toFixed(2));


    }


    function showToastNewWallet() {

        M.toast({
            html: '<strong>' + $('#NewWalletCongratulation2').val() + '</strong>',
            classes: 'toclass',
            displayLength: 7000
        });
    }


    function showToast(text, color) {
        M.toast({
            html: '<strong>' + text + '</strong>',
            classes: 'toastclass_' + color,
            displayLength: 7000

        })
    }


    function addressInfo(accType, privKeyRAW, accAddress = '') {
        // accType = 1 - MetaMask
        // accType = 2 - UTC file
        // accType = 3 - Raw private key
        // accType = 4 - New account (UTC)
        // accType = 5 - Seed
        // accType = 6 - Parity Signer
        $("#start").hide();
        $("#aboutAddress").show();
        $('.tabs').tabs('updateTabIndicator');
        if (accType == 1) {

            //window.web3old = window.web3.currentProvider;
            window.web3 = new Web3(window.web3.currentProvider);
            web3.eth.net.getId()
                .then(function (netId) {
                    $('#networkName').formSelect();
                    switch (netId) {
                        case 1:
                            $("#networkName").val("mainnet");
                            break
                        case 3:
                            $("#networkName").val("ropsten");
                            break
                        case 4:
                            $("#networkName").val("rinkeby");
                            break
                        case 42:
                            $("#networkName").val("kovan");
                            break
                        default:
                            console.log('This is an unknown network!  NetId: ' + netId)
                    }
                    $('#networkName').formSelect();
                    web3.eth.getAccounts(function (err, res) {
                        if (err) {
                            console.log("Can't connet to metamask");
                        }
                        window.address = res[0];
                        window.connectType = 1
                        load()
                    })
                });


        } else if (accType == 2) {
            window.connectType = 2
            window.address = accAddress
            window.privateKey = privKeyRAW
            window.web3 = new Web3(new Web3.providers.WebsocketProvider("wss://" + $("#networkName").val() + ".infura.io/ws/v3/96a551661d68428395068307f67dae53"))

            load()
        } else if (accType == 3 || accType == 4) {
            window.web3 = new Web3(new Web3.providers.WebsocketProvider("wss://" + $("#networkName").val() + ".infura.io/ws/v3/96a551661d68428395068307f67dae53"))
            if (accType == 3) {
                if ($('#unencryptPrivateKeyRaw').val().indexOf('0x') != 0) {
                    addressObj = web3.eth.accounts.privateKeyToAccount('0x' + $('#unencryptPrivateKeyRaw').val())
                    window.privateKey = '0x' + $('#unencryptPrivateKeyRaw').val();
                } else {
                    addressObj = web3.eth.accounts.privateKeyToAccount($('#unencryptPrivateKeyRaw').val())
                    window.privateKey = $('#unencryptPrivateKeyRaw').val()
                }

                window.connectType = 3;
                window.address = addressObj.address;
                $('#buttonDownloadUTC').css('display', 'inline');
            } else if (accType == 4) {

                setTimeout(showToastNewWallet, 1500);
                addressObj = web3.eth.accounts.privateKeyToAccount(privKeyRAW)
                window.privateKey = privKeyRAW;
                window.address = addressObj.address;
                window.connectType = 4;
                $('#newWalletCreateAlert').show();
            }


            load()
        }

        setTimeout(function () {
            $('#chartEth').attr('src', '/chart.html');
        }, 1000);
    }

});


function moreTokens() {
    var itoken = $('#tokensTabLink');
    itoken[0].click();
}

function moreTransactions() {
    var itransaction = $('#txTabLink');
    itransaction[0].click();
}

// Get the modal
var popUpModal = $('#modalGetETH');
// Get the button that opens the modal
var popUpModalBtn = $('#buttonPopUp');
// Get the <span> element that closes the modal
var modalSpanClose = $('.close-modal');
// When the user clicks the button, open the modal
popUpModalBtn.on("click", showModal);
// When the user clicks on <span> (x), close the modal
modalSpanClose.on("click", function () {
    popUpModal.css("display", "none");
});
// When the user clicks anywhere outside of the modal, close it
$(window).on("click", function (event) {
    if ($(event.target).attr("id") === "modalGetETH") {
        popUpModal.css("display", "none");
    }
});

function showModal() {
    var out = '';
    popUpModal.css("display", "flex");
    $('.modal-header-title').text($("#getTestETHPopUpHeader").val());
    if ($("#networkName").val() == 'ropsten') {
        out = $("#getTestETHPopUpRopsten").val();
    }
    if ($("#networkName").val() == 'rinkeby') {
        out = $("#getTestETHPopUpRinkeby").val();
    }
    if ($("#networkName").val() == 'kovan') {
        out = $("#getTestETHPopUpKovan").val();
    }
    $('.modal-content-test-eth').html(out);
}
