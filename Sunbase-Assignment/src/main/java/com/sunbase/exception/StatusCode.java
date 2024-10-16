package com.sunbase.exception;

public interface StatusCode {
    
	int OK = 200;
    int CREATED = 201;
    int ACCEPTED = 202;
    int NO_CONTENT = 204;
    
    int MOVED_PERMANENTLY = 301;
    int FOUND = 302;
    int SEE_OTHER = 303;
    int NOT_MODIFIED = 304;
    int TEMPORARY_REDIRECT = 307;
    int PERMANENT_REDIRECT = 308;

    int BAD_REQUEST = 400;
    int UNAUTHORIZED = 401;
    int FORBIDDEN = 403;
    int NOT_FOUND = 404;
    int METHOD_NOT_ALLOWED = 405;
    int CONFLICT = 409;
    int GONE = 410;
    int UNSUPPORTED_MEDIA_TYPE = 415;
    int TOO_MANY_REQUESTS = 429;

    int INTERNAL_SERVER_ERROR = 500;
    int NOT_IMPLEMENTED = 501;
    int BAD_GATEWAY = 502;
    int SERVICE_UNAVAILABLE = 503;
    int GATEWAY_TIMEOUT = 504;
}
