package com.example.QuickBite.food.repository;

import com.example.QuickBite.food.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<FoodItem, Long> {

    // Support search by food name (containing, case-insensitive)
    List<FoodItem> findByNameContainingIgnoreCase(String name);

    // Support category filtering (case-insensitive)
    List<FoodItem> findByCategoryIgnoreCase(String category);
}
