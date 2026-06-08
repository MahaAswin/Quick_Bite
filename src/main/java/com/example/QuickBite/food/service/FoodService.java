package com.example.QuickBite.food.service;

import com.example.QuickBite.food.entity.FoodItems;
import java.util.List;

public interface FoodService {

    FoodItems addFood(FoodItems foodItem);

    FoodItems updateFood(Long id, FoodItems foodItem);

    void deleteFood(Long id);

    FoodItems getFoodById(Long id);

    List<FoodItems> getAllFoods();

    List<FoodItems> searchFood(String name);

    List<FoodItems> getFoodsByCategory(String category);

    FoodItems updateStock(Long id, Integer quantity);
}
