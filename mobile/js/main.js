/*
 *
 * mads - version 2.00.01
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 */

var mads = function () {
    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }

    /* CT */
    if (typeof ct == 'undefined' && typeof rma != 'undefined') {
        this.ct = rma.ct;
    } else if (typeof ct != 'undefined') {
        this.ct = ct;
    } else {
        this.ct = [];
    }

    /* CTE */
    if (typeof cte == 'undefined' && typeof rma != 'undefined') {
        this.cte = rma.cte;
    } else if (typeof cte != 'undefined') {
        this.cte = cte;
    } else {
        this.cte = [];
    }

    /* tags */
    if (typeof tags == 'undefined' && typeof tags != 'undefined') {
        this.tags = this.tagsProcess(rma.tags);
    } else if (typeof tags != 'undefined') {
        this.tags = this.tagsProcess(tags);
    } else {
        this.tags = '';
    }

    /* Unique ID on each initialise */
    this.id = this.uniqId();

    /* Tracked tracker */
    this.tracked = [];
    /* each engagement type should be track for only once and also the first tracker only */
    this.trackedEngagementType = [];
    /* trackers which should not have engagement type */
    this.engagementTypeExlude = [];
    /* first engagement */
    this.firstEngagementTracked = false;

    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];

    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];

    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');

    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';

    /* Solve {2} issues */
    for (var i = 0; i < this.custTracker.length; i++) {
        if (this.custTracker[i].indexOf('{2}') != -1) {
            this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
        }
    }
};

/* Generate unique ID */
mads.prototype.uniqId = function () {

    return new Date().getTime();
}

mads.prototype.tagsProcess = function (tags) {

    var tagsStr = '';

    for (var obj in tags) {
        if (tags.hasOwnProperty(obj)) {
            tagsStr += '&' + obj + '=' + tags[obj];
        }
    }

    return tagsStr;
}

/* Link Opner */
mads.prototype.linkOpener = function (url) {

    if (typeof url != "undefined" && url != "") {

        if (typeof mraid !== 'undefined') {
            mraid.open(url);
        } else {
            window.open(url);
        }
    }
}

/* tracker */
mads.prototype.tracker = function (tt, type, name, value) {

    /*
     * name is used to make sure that particular tracker is tracked for only once
     * there might have the same type in different location, so it will need the name to differentiate them
     */
    name = name || type;

    if (typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1) {
        for (var i = 0; i < this.custTracker.length; i++) {
            var img = document.createElement('img');

            if (typeof value == 'undefined') {
                value = '';
            }

            /* Insert Macro */
            var src = this.custTracker[i].replace('{{rmatype}}', type);
            src = src.replace('{{rmavalue}}', value);

            /* Insert TT's macro */
            if (this.trackedEngagementType.indexOf(tt) != '-1' || this.engagementTypeExlude.indexOf(tt) != '-1') {
                src = src.replace('tt={{rmatt}}', '');
            } else {
                src = src.replace('{{rmatt}}', tt);
                this.trackedEngagementType.push(tt);
            }

            /* Append ty for first tracker only */
            if (!this.firstEngagementTracked && tt == 'E') {
                src = src + '&ty=E';
                this.firstEngagementTracked = true;
            }

            /* */
            img.src = src + this.tags + '&' + this.id;

            img.style.display = 'none';
            this.bodyTag.appendChild(img);

            this.tracked.push(name);
        }
    }
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback, id) {
    if (id && document.getElementById(id)) {
        callback();
        return;
    }

    var script = document.createElement('script');
    script.src = js;
    if (id) {
        script.id = id;
    }


    if (typeof callback != 'undefined') {
        script.onload = callback;
    }

    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function (href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');

    this.headTag.appendChild(link);
}


var ad = function (_m) {
    // var _m = new mads();

    var selfie;


    _m.loadCss(_m.path + "css/style.css");

    var sliderHead = '<div id="chooser"><div class="slider js_slider"> <div class="frame js_frame"> <ul class="slides js_slides"> <li class="js_slide selected"><img class="image1" src="' + _m.path + 'img/1-d.png"></li><li class="js_slide"><img class="image2" src="' + _m.path + 'img/2-d.png"></li><li class="js_slide"><img class="image3" src="' + _m.path + 'img/3-d.png"></li><li class="js_slide"><img class="image4" src="' + _m.path + 'img/4-d.png"></li><li class="js_slide"><img class="image5" src="' + _m.path + 'img/5-d.png"></li><li class="js_slide"><img class="image6" src="' + _m.path + 'img/6-d.png"></li></ul> </div><img class="js_prev prev" src="' + _m.path + 'img/slider_btn.png"> <img class="js_next next" src="' + _m.path + 'img/slider_btn.png"> </div></div><div id="buttons"><div id="kembali">Kembali</div><div id="pilih">Pilih</div></div>';

    _m.contentTag.innerHTML = '<div id="adc"><div id="first"><label id="btnSelfie" for="file-input">Selfie<input type="file" accept="image/*;capture=camera" id="file-input"></label></div><div id="second"><img id="instruction" src="' + _m.path + 'img/gif.gif"><div class="mask"></div><div id="controls"><img class="rotate" src="' + _m.path + 'img/rotate.png"><img class="zoomin" src="' + _m.path + 'img/zoom_plus.png"><img class="zoomout" src="' + _m.path + 'img/zoom_minus.png"></div><div id="containerwork"><div id="workspace"></div></div>' + sliderHead + '</div><div id="last"><div id="lastic"></div><img src="' + _m.path + 'img/last.png"><img id="fb-share" src="' + _m.path + 'img/fb-icn.png"><img id="tw-share" src="' + _m.path + 'img/tw-icn.png"><div id="coba">Coba Lagi</div><div id="info">Info Hadiah</div></div></div><div id="overlay-1"></div>';


    var firstPage = _m.contentTag.querySelector('#first');
    firstPage.style.background = "url(" + _m.path + "img/first.png)";

    var secondPage = _m.contentTag.querySelector('#second');
    secondPage.style.background = "url(" + _m.path + "img/second.png)";

    var lastPage = _m.contentTag.querySelector('#last');

    var inputFile = _m.contentTag.querySelector('input');

    var btnSelfie = _m.contentTag.querySelector('#btnSelfie');
    btnSelfie.addEventListener('click', function () {
        _m.tracker('E', 'selfie_click');
    })


    inputFile.addEventListener('change', function (e) {
        var files = inputFile.files;
        var len = files.length;

        if (FileReader && files && len) {
            var fr = new FileReader();
            fr.onload = function () {
                var dimg = selfie = new Image();
                dimg.id = 'selfie'
                dimg.onload = function () {
                    var r = Math.min(290 / this.width);
                    dimg.width = this.width * r;
                }
                dimg.src = fr.result;
                workspace.appendChild(dimg);
                addControlTo(dimg);
            }
            fr.readAsDataURL(files[0])
            _m.tracker('E', 'selfie_added');
            GotoPage(2)
        }
    });

    var mask = _m.contentTag.querySelector('.mask');
    var inst = _m.contentTag.querySelector('#instruction');

    var kembali = _m.contentTag.querySelector('#kembali');
    var pilih = _m.contentTag.querySelector('#pilih');
    kembali.addEventListener('click', function () {
        _m.tracker('E', 'go_back');
        GotoPage(1);
    });
    var lastimg = new Image();
    lastimg.id = "lastimg";
    pilih.addEventListener('click', function () {

        activ.onload = function () {
            // lastimg = workspace.cloneNode(true);
            // lastimg.id = "lastimg";

            // GotoPage(3);
            setTimeout(function () {
                html2canvas(workspace, {
                    onrendered: function (canvas) {
                        _m.tracker('E', 'choose');

                        lastimg.onload = function () {
                            GotoPage(3);
                        }
                        lastimg.src = canvas.toDataURL("image/png");
                    }
                })
            }, 500);

        }

        activ.src = activ.src.replace('-d', '-e');


    })

    var reset = _m.contentTag.querySelector('#coba');
    reset.addEventListener('click', function () {
        _m.tracker('E', 'reset');
        GotoPage(1);
    })

    var info = _m.contentTag.querySelector('#info');
    info.addEventListener('click', function () {
        _m.tracker('CTR', 'landing_page');
        _m.linkOpener('http://www.rumahcantikcitra.co.id/artikel/syarat-dan-ketentuan/');
    })

    var lastic = _m.contentTag.querySelector('#lastic')

    var fbshare = _m.contentTag.querySelector('#fb-share');
    var twshare = _m.contentTag.querySelector('#tw-share');

    var masklast = document.createElement('div')
    masklast.className = 'mask'
    masklast.style.display = 'none'
    masklast.style.textAlign = 'center'
    masklast.style.lineHeight = '380px'
    masklast.style.color = 'white'
    masklast.innerHTML = 'Loading...'
    lastPage.appendChild(masklast)

    fbshare.addEventListener('click', function () {
        _m.tracker('E', 'fb_share');
        // _m.linkOpener('https://www.facebook.com/Rumah-Cantik-Citra-79003217653/');
        uploadStage1('fb')
    })
    twshare.addEventListener('click', function () {
        _m.tracker('E', 'tw_share');
        uploadStage1('twit')
        // _m.linkOpener('https://twitter.com/CantikCitra');
    })

    var dataURItoBlob = function (dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }

    var particle = _m.path;
    var protocol = particle.split('/') + '//';

    var uploadStage2 = function (dnow, social) {

        var domain = "https://rmarepo.richmediaads.com/"
        // <meta property="og:url" content="http://www.rumahcantikcitra.co.id/artikel/syarat-dan-ketentuan/">
        var html = '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <title>${title}</title> <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"> <meta http-equiv="refresh" content="3;url=http://www.rumahcantikcitra.co.id/artikel/syarat-dan-ketentuan/" /> <meta property="og:type" content="image"> <meta property="og:title" content="${title}"> <meta property="og:description" content="${description}"> <meta property="og:image" content="${image}"> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:url" content="http://www.rumahcantikcitra.co.id/artikel/syarat-dan-ketentuan/"> <meta name="twitter:site" content="@CantikCitra"> <meta name="twitter:title" content="${title}"> <meta name="twitter:description" content="${description}"> <meta name="twitter:creator" content="@CantikCitra"> <meta name="twitter:image" content="${image}"> <meta name="twitter:domain" content="www.rumahcantikcitra.co.id"> <meta name="description" content="${description}"> <meta name="DC.title" content="${title}"> <!-- Latest compiled and minified CSS --> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"> <style> /* Space out content a bit */ body { padding-top: 20px; padding-bottom: 20px; } /* Everything but the jumbotron gets side spacing for mobile first views */ .header, .marketing, .footer { padding-right: 15px; padding-left: 15px; } /* Custom page header */ .header { padding-bottom: 20px; border-bottom: 1px solid #e5e5e5; } /* Make the masthead heading the same height as the navigation */ .header h3 { margin-top: 0; margin-bottom: 0; line-height: 40px; } /* Custom page footer */ .footer { padding-top: 19px; color: #777; border-top: 1px solid #e5e5e5; } /* Customize container */ @media (min-width: 768px) { .container { max-width: 730px; } } .container-narrow>hr { margin: 30px 0; } /* Main marketing message and sign up button */ .jumbotron { text-align: center; border-bottom: 1px solid #e5e5e5; } .jumbotron .btn { padding: 14px 24px; font-size: 21px; } /* Supporting marketing content */ .marketing { margin: 40px 0; } .marketing p+h4 { margin-top: 28px; } /* Responsive: Portrait tablets and up */ @media screen and (min-width: 768px) { /* Remove the padding we set earlier */ .header, .marketing, .footer { padding-right: 0; padding-left: 0; } /* Space out the masthead */ .header { margin-bottom: 30px; } /* Remove the bottom border on the jumbotron for visual effect */ .jumbotron { border-bottom: 0; } } </style></head><body> <div class="container"> <div class="jumbotron"> <div class="row marketing"> <img src="${image}" alt="${title}"> <h1 class="title">${title}</h1> <p class="description">${description}</p> <p><strong>You\'ll be redirected to our site. Please wait for 5 seconds.</strong></p> </div> </div> </div> <!-- Latest compiled and minified JavaScript --> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script></body></html>'

        html = html.replace(/\$\{title\}/g, 'Citra Wakame');
        html = html.replace(/\$\{description\}/g, 'Solusi bagi kamu yang berhijab, untuk tetap bisa pake lotion tanpa rasa lengket');
        html = html.replace(/\$\{image\}/g, domain + "2901/custom/sunsilk_hijab_citra/uploads/" + dnow + '/image.png');

        var htmlBLOB = new Blob([html], { type: 'text/html' });

        var data = new FormData();
        data.append("pic[]", htmlBLOB);
        data.append("path", "2901/custom/sunsilk_hijab_citra/uploads/" + dnow);
        data.append("name", "index.html");
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                var msg = encodeURIComponent('Solusi bagi kamu yang berhijab, untuk tetap bisa pake lotion tanpa rasa lengke')
                var url = encodeURIComponent(domain + '2901/custom/sunsilk_hijab_citra/uploads/' + dnow + '/index.html')
                if (social == 'fb') {
                  _m.linkOpener('https://www.facebook.com/sharer/sharer.php?u='+url)
                } else if (social == 'twit') {
                  var referrer = encodeURIComponent('http://www.rumahcantikcitra.co.id/artikel/syarat-dan-ketentuan/')
                  var text = encodeURIComponent('Yuk rajin pake Citra Wakame agar kulit cerah tanpa rasa lengket');
                  _m.linkOpener('https://twitter.com/intent/tweet?text='+text+'&original_referer='+referrer+'&url='+url+'&tw_p=tweetbutton&via=CantikCitra')
                }
                masklast.style.display = 'none'
                console.log('stage2', this.responseText);
            }
        });
        xhr.open("POST", protocol + "www.mobileads.com/upload-image-twtbk");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(data)

    }



    var uploadStage1 = function (social) {

      masklast.style.display = 'block'


        var dnow = Math.floor(Date.now() / 1000);

        var data = new FormData();
        data.append("pic[]", dataURItoBlob(lastimg.src));
        data.append("path", "2901/custom/sunsilk_hijab_citra/uploads/" + dnow);
        data.append("name", "image.png");

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log('stage1', this.responseText);
                uploadStage2(dnow, social);
            }
        });

        xhr.open("POST", protocol + "www.mobileads.com/upload-image-twtbk");
        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(data);
    }


    var rotate = _m.contentTag.querySelector('#controls .rotate');
    var zoomin = _m.contentTag.querySelector('#controls .zoomin');
    var zoomout = _m.contentTag.querySelector('#controls .zoomout');

    rotate.addEventListener('click', function () {
        Velocity(selfie, {
            rotateZ: '+=45deg'
        })
    })
    zoomin.addEventListener('click', function () {
        Velocity(selfie, {
            scale: '+=0.1'
        })
    })
    zoomout.addEventListener('click', function () {
        Velocity(selfie, {
            scale: '-=0.1'
        })
    })


    var images = _m.contentTag.querySelectorAll(".js_slide")
    var activ;
    for (i = 0; i < images.length; i++) {
        (function (i) {
            images[i].addEventListener('click', function () {
                _m.contentTag.querySelector('.js_slide.selected').className = 'js_slide';
                images[i].className += ' selected';
                activ.src = _m.contentTag.querySelector('#chooser .selected img').src;
            });
        })(i);
    }

    var workspace = _m.contentTag.querySelector('#workspace');

    var addControlTo = function (dimg) {
        var manager = new Hammer.Manager(dimg);

        var Pan = new Hammer.Pan();
        var Rotate = new Hammer.Rotate();
        var Pinch = new Hammer.Pinch();

        Rotate.recognizeWith([Pan]);
        Pinch.recognizeWith([Rotate, Pan]);

        manager.add(Pan);
        manager.add(Rotate);
        manager.add(Pinch);

        // Rotating
        var liveScale = 0.2;
        var currentRotation = 0;
        manager.on('rotatemove', function (e) {
            var rotation = currentRotation + Math.round(liveScale * e.rotation);
            Velocity.hook(dimg, 'rotateZ', rotation + 'deg');
        });
        manager.on('rotateend', function (e) {
            currentRotation += Math.round(e.rotation);
        });

        // Panning
        var deltaX = 0;
        var deltaY = 0;
        manager.on('panmove', function (e) {
            var dx = deltaX + (e.deltaX);
            var dy = deltaY + (e.deltaY);

            Velocity.hook(dimg, 'translateX', dx + 'px');
            Velocity.hook(dimg, 'translateY', dy + 'px');
        });
        manager.on('panend', function (e) {
            deltaX = deltaX + e.deltaX;
            deltaY = deltaY + e.deltaY;
        })

        // Scaling
        var currentScale = 1;

        function getRelativeScale(scale) {
            return scale * currentScale;
        }
        manager.on('pinchmove', function (e) {
            var scale = getRelativeScale(e.scale);
            Velocity.hook(dimg, 'scale', scale);
        });
        manager.on('pinchend', function (e) {
            currentScale = getRelativeScale(e.scale);
            liveScale = currentScale;
        });
    }

    // Goto
    var GotoPage = function (page, d) {
        switch (page) {
            case 1:
                firstPage.style.display = 'block';
                secondPage.style.display = 'none';
                lastPage.style.display = 'none';
                mask.style.display = 'block';
                inst.style.display = 'block';
                break;
            case 2:
                inst.src = inst.src.replace(/\?.*$/, "") + "?x=" + Math.random();
                firstPage.style.display = 'none';
                secondPage.style.display = 'block';
                workspace.innerHTML = '';
                activ = _m.contentTag.querySelector('#chooser .selected img').cloneNode(true);
                activ.className = 'coverlay';
                workspace.appendChild(activ);
                if (d) {
                    var dimg = selfie = new Image();
                    dimg.id = 'selfie'
                    dimg.onload = function () { }
                    dimg.src = _m.path + 'img/first.png';
                    workspace.appendChild(dimg);
                    addControlTo(dimg);
                }
                _m.loadJs(_m.path + 'js/lory.min.js', function () {
                    setTimeout(function () {
                        var slider = _m.contentTag.querySelector('.js_slider');
                        lory(slider, {
                            slidesToScroll: 3
                        })
                    }, 500)
                }, 'lory')
                var close = function () {
                    mask.style.display = 'none';
                    inst.style.display = 'none';
                }
                setTimeout(function () {
                    mask.addEventListener('click', close)
                }, 6000);
                setTimeout(function () {
                    close();
                }, 10000)
                break;
            case 3:
                firstPage.style.display = 'none';
                secondPage.style.display = 'none';
                lastPage.style.display = 'block';
                lastic.innerHTML = ''
                if (lastimg) {
                    lastic.appendChild(lastimg);
                }
                break;
        }
    }

    // if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    //     GotoPage(2, true)

};

(function (ad) {
    var _m = new mads();
    var scripts = [_m.path + 'js/hammer.min.js', _m.path + 'js/velocity.min.js', _m.path + 'js/html2canvas.min.js'];
    var loadCount = scripts.length;

    function done() {
        loadCount -= 1;
        if (loadCount == 0) {
            ad(_m);
        }
    }

    for (var i = 0; i < scripts.length; i++) {
        _m.loadJs(scripts[i], done);
    }
})(ad)
