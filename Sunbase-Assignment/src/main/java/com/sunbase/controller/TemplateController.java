package com.sunbase.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class TemplateController {
    @GetMapping("/login-signup")
    public String loginSignupPage() {
        return "login-signup";
    }

    @GetMapping("/index")
    public String homePage() {
        return "index";
    }
}
