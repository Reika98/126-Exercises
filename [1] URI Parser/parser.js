var form = document.getElementById('url-form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    var uri = document.getElementById('uri-box').value;
    var uriParts = parseUri(uri);
    render(uriParts);
});

function render(uriParts) {
    document.getElementById('parts').className = '';
    for (var key in uriParts) {
        document.getElementById(key + '-value').innerHTML = uriParts[key];
    }
}

function parseUri(uri) {
    var uriParts = {
        scheme: '',
        authority: '',
        path: '',
        query: '',
        fragment: ''
    };

    var str = uri;
    var end = str.indexOf(":");
    if(end > 0) {
        uriParts.scheme = str.substring(0, end);
        str = str.substring(str.indexOf("/")+2, str.length);
        end = str.indexOf("/");

        if(end > 0) {
            uriParts.authority = str.substring(0, end);
            str = str.substring(end, str.length);
            
            if(str.indexOf("?") > 0 || str.indexOf("#") > 0) {
                var flag;
                if(str.indexOf("?") >=0 && str.indexOf("?") < str.indexOf("#")) {
                    flag = 0;
                    end = str.indexOf("?");
                }
                else{
                    flag = 1;
                    end = str.indexOf("#");
                }

                uriParts.path = str.substring(0, end);
                str = str.substring(end+1, str.length);

                if(flag == 0) {
                    end = str.indexOf("#");
                    if(end > 0) {
                        uriParts.query = str.substring(0, end);
                        uriParts.fragment = str.substring(end+1,str.length);
                    }
                    else
                        uriParts.query = str;
                }
                else {
                    uriParts.fragment = str.substring(1, str.length);
                }

            }
            else
                uriParts.path = str;
        }
        else
            uriParts.authority = str;
        
    }
    else
        uriParts.scheme = str;    

    return uriParts;
}