package com.example.QuickBite.order.repository;

import com.example.QuickBite.order.entity.Order;
import com.example.QuickBite.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByUser(User user);
}
