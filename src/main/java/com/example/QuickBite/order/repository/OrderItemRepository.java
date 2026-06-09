package com.example.QuickBite.order.repository;

import com.example.QuickBite.order.entity.Order;
import com.example.QuickBite.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
    List<OrderItem> findByOrder(Order order);
}
