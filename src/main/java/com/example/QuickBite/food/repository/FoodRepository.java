package com.example.QuickBite.food.repository;

import com.example.QuickBite.food.entity.FoodItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<FoodItems, Long> {
    List<FoodItems> findByPrice(Double price);

    // Support search by food name (containing, case-insensitive)
    List<FoodItems> findByNameContainingIgnoreCase(String name);

    // Support category filtering (case-insensitive)
    List<FoodItems> findByCategoryIgnoreCase(String category);

    // Identify food items with quantity less than a threshold (e.g. 5)
    List<FoodItems> findByQuantityLessThan(Integer quantity);

    // Return only food items where available = true
    List<FoodItems> findByAvailableTrue();

    // Return only food items where quantity = 0 or available = false
    @Query("SELECT f FROM FoodItems f WHERE f.quantity = 0 OR f.available = false")
    List<FoodItems> findOutOfStockFoods();

    // Return all foods within the given price range
    List<FoodItems> findByPriceBetweenAndAvailableTrue(Double min, Double max);

    List<FoodItems> findByAvailableTrueOrderByPriceAsc();

    List<FoodItems> findByAvailableTrueOrderByPriceDesc();
}
