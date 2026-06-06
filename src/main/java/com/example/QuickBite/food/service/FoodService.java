package com.example.QuickBite.food.service;

import com.example.QuickBite.food.entity.FoodItem;
import java.util.List;

public interface FoodService {

    FoodItem addFood(FoodItem foodItem);

    FoodItem updateFood(Long id, FoodItem foodItem);

    void deleteFood(Long id);

    FoodItem getFoodById(Long id);

    List<FoodItem> getAllFoods();

    List<FoodItem> searchFood(String name);

    List<FoodItem> getFoodsByCategory(String category);

    FoodItem updateStock(Long id, Integer quantity);
}
