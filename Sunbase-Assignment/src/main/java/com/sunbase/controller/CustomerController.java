package com.sunbase.controller;

import com.sunbase.exception.Response;
import com.sunbase.exception.StatusCode;
import com.sunbase.model.Customer;
import com.sunbase.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;

    @PostMapping("/saveCustomer")
    public Response<Customer> saveCustomer(@RequestBody Customer customer) {
        Customer savedCustomer = customerService.saveCustomer(customer);
        return new Response<>(savedCustomer, "Customer saved successfully", StatusCode.CREATED);
    }

    @PutMapping("/updateCustomer")
    public Response<Customer> updateCustomer(@RequestBody Customer customer) {
        if (customerService.getCustomerById(customer.getUuid()).isPresent()) {
            Customer updatedCustomer = customerService.saveCustomer(customer);
            return new Response<>(updatedCustomer, "Customer updated successfully...", StatusCode.CREATED);
        }
        return new Response<>("Customer not found...", StatusCode.NOT_FOUND);
    }

    @DeleteMapping("/deleteCustomerByUuid")
    public Response<String> deleteCustomer(@RequestParam String uuid) {
        try {
            customerService.deleteCustomer(uuid);
            return new Response<>("Customer deleted successfully...", StatusCode.OK);
        } catch (RuntimeException e) {
            return new Response<>(e.getMessage(), StatusCode.BAD_REQUEST);
        }
    }

    @GetMapping("/getCustomerByUuid")
    public Response<Customer> getCustomerById(@RequestParam String uuid) {
        return customerService.getCustomerById(uuid)
                .map(customer -> new Response<>(customer, "Customer fetched", StatusCode.OK))
                .orElse(new Response<>("Customer not found", StatusCode.NOT_FOUND));
    }

    @GetMapping("/getCustomerByEmail")
    public Response<Customer> getCustomerByEmail(@RequestParam String email) {
        return customerService.getCustomerByEmail(email)
                .map(customer -> new Response<>(customer, "Customer fetched", StatusCode.OK))
                .orElse(new Response<>("Customer not found", StatusCode.NOT_FOUND));
    }

    @GetMapping("/getAllCustomers")
    public Response<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        if (customers.isEmpty())
            return new Response<>("No Customers found...", StatusCode.NOT_FOUND);
        return new Response<>(customers, "Customers fetched successfully...", StatusCode.OK);
    }

    @GetMapping("/getCurrentLoggedInCustomer")
    public Response<?> getLoggedInUser() {
        try {
            Customer loggedInCustomer = customerService.getLoggedInCustomer();
            return new Response<>(loggedInCustomer, "Customer found...", StatusCode.OK);
        } catch (RuntimeException e) {
            return new Response<>(e.getMessage(), StatusCode.UNAUTHORIZED);
        }
    }

    @GetMapping("/getCustomersByPageWise/{pageNo}/{pageSize}")
    public Response<List<Customer>> getCustomersPageWise(@PathVariable Integer pageNo, @PathVariable Integer pageSize) {
        List<Customer> customers = customerService.getCustomerPageWise(pageNo, pageSize);
        return new Response<>(customers, "Customers fetched successfully by using pagination...", StatusCode.OK);
    }

    @GetMapping("/syncCustomerFromSunbaseDatabase")
    public Response<?> syncCustomers() {
        try {
            List<Customer> savedOrUpdatedCustomers = customerService.saveOrUpdateInBulk(customerService.fetchDataFromServer());
            return new Response<>(savedOrUpdatedCustomers, "Updated Customers in bulk successfully...", StatusCode.CREATED);
        } catch (IOException e) {
            return new Response<>(e.getMessage(), StatusCode.INTERNAL_SERVER_ERROR);
        }
    }
}