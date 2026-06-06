package com.example.QuickBite.food.service;

import com.example.QuickBite.food.entity.FoodItem;
import com.example.QuickBite.food.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FoodServiceImp implements FoodService {

    private final FoodRepository foodRepository;

    @Override
    public FoodItem addFood(FoodItem foodItem) {
        if (foodItem == null) {
            throw new IllegalArgumentException("Food item details cannot be null");
        }
        applyAvailabilityRule(foodItem);
        return foodRepository.save(foodItem);
    }

    @Override
    public FoodItem updateFood(Long id, FoodItem foodItem) {
        FoodItem existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));

        existingFood.setName(foodItem.getName());
        existingFood.setDescription(foodItem.getDescription());
        existingFood.setPrice(foodItem.getPrice());
        existingFood.setCategory(foodItem.getCategory());
        existingFood.setQuantity(foodItem.getQuantity());
        existingFood.setImageUrl(foodItem.getImageUrl());

        applyAvailabilityRule(existingFood);
        return foodRepository.save(existingFood);
    }

    @Override
    public void deleteFood(Long id) {
        FoodItem existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
        foodRepository.delete(existingFood);
    }

    @Override
    @Transactional(readOnly = true)
    public FoodItem getFoodById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FoodItem> getAllFoods() {
        return foodRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FoodItem> searchFood(String name) {
        return foodRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FoodItem> getFoodsByCategory(String category) {
        return foodRepository.findByCategoryIgnoreCase(category);
    }

    @Override
    public FoodItem updateStock(Long id, Integer quantity) {
        FoodItem existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));

        existingFood.setQuantity(quantity);
        applyAvailabilityRule(existingFood);
        return foodRepository.save(existingFood);
    }

    /**
     * Enforces the business rules:
     * - If quantity becomes 0 (or less), set available = false.
     * - If quantity is greater than 0, set available = true.
     */
    private void applyAvailabilityRule(FoodItem foodItem) {
        if (foodItem.getQuantity() == null || foodItem.getQuantity() <= 0) {
            foodItem.setQuantity(0);
            foodItem.setAvailable(false);
        } else {
            foodItem.setAvailable(true);
        }
    }
}
