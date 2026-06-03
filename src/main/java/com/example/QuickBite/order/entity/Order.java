package com.example.QuickBite.order.entity;

import com.example.QuickBite.user.entity.OrderStatus;
import com.example.QuickBite.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="orders")
public class Order{

    private Long id;
    private String tokenNumber;
    private Double totalAmount;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private LocalDateTime orderTime;
    @ManyToOne
    @JoinColumn(name="user_id")
    private User user_id;
}
