package com.sunbase.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sunbase.model.Customer;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, String> {
    Optional<Customer> findByEmail(String email);
}
