package com.sunbase.exception;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
public class Response<T> {
	
    private T data;
    private String message;
    private int statusCode;
    private String jwtToken;

    public Response(String message, int statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }

    public Response(T data, String message, int statusCode) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }

    public Response(String message, int statusCode, String jwtToken) {
        this.message = message;
        this.statusCode = statusCode;
        this.jwtToken = jwtToken;
    }
}