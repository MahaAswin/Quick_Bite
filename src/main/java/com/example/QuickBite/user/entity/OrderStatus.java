package com.example.QuickBite.user.entity;

public class OrderStatus {
    public enum orderStatus{
        PENDING,
        CONFIRMED,
        PREPARING,
        OUT_FOR_DELIVERY,
        DELIVERED,
        CANCELLED
    }
}
