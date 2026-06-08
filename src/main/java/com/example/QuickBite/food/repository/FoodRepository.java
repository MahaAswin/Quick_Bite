package com.example.QuickBite.food.repository;

import com.example.QuickBite.food.entity.FoodItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<FoodItems, Long> {

    // Support search by food name (containing, case-insensitive)
    List<FoodItems> findByNameContainingIgnoreCase(String name);

    // Support category filtering (case-insensitive)
    List<FoodItems> findByCategoryIgnoreCase(String category);
}
