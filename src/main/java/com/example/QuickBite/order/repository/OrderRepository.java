package com.example.QuickBite.order.repository;

import com.example.QuickBite.enums.OrderStatus;
import com.example.QuickBite.order.entity.Order;
import com.example.QuickBite.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByUser(User user);
    Optional<Order> findByIdAndUser(Long id, User user);
    List<Order> findByOrderStatus(OrderStatus orderStatus);
}
