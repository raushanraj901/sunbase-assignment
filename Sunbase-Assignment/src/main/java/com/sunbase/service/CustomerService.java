package com.sunbase.service;

import com.sunbase.model.Customer;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface CustomerService {
    Customer saveCustomer(Customer customer);

    Optional<Customer> getCustomerById(String uuid);

    Optional<Customer> getCustomerByEmail(String email);

    Customer getLoggedInCustomer();

    void deleteCustomer(String uuid);

    List<Customer> getAllCustomers();

    List<Customer> getCustomerPageWise(Integer pageNo, Integer pageSize);

    List<Customer> saveOrUpdateInBulk(List<Customer> customers);

    List<Customer> fetchDataFromServer() throws IOException;
}
