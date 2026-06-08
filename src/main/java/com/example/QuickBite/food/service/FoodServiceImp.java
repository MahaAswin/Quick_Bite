package com.example.QuickBite.food.service;

import com.example.QuickBite.food.entity.FoodItems;
import com.example.QuickBite.food.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FoodServiceImp {

    private final FoodRepository foodRepository;

    public FoodItems addFood(FoodItems foodItem) {
        if (foodItem == null) {
            throw new IllegalArgumentException("Food item details cannot be null");
        }
        applyAvailabilityRule(foodItem);
        return foodRepository.save(foodItem);
    }

    public FoodItems updateFood(Long id, FoodItems foodItem) {
        FoodItems existingFood = foodRepository.findById(id)
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

    public void deleteFood(Long id) {
        FoodItems existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
        foodRepository.delete(existingFood);
    }

//    @Transactional(readOnly = true)
    public FoodItems getFoodById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
    }

//    @Transactional(readOnly = true)
    public List<FoodItems> getAllFoods() {
        return foodRepository.findAll();
    }

//    @Transactional(readOnly = true)
    public List<FoodItems> searchFood(String name) {
        return foodRepository.findByNameContainingIgnoreCase(name);
    }

//    @Transactional(readOnly = true)
    public List<FoodItems> getFoodsByCategory(String category) {
        return foodRepository.findByCategoryIgnoreCase(category);
    }

    public FoodItems updateStock(Long id, Integer quantity) {
        FoodItems existingFood = foodRepository.findById(id)
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
    private void applyAvailabilityRule(FoodItems foodItem) {
        if (foodItem.getQuantity() == null || foodItem.getQuantity() <= 0) {
            foodItem.setQuantity(0);
            foodItem.setAvailable(false);
        } else {
            foodItem.setAvailable(true);
        }
    }
}
