package com.example.QuickBite.food.service;

import com.example.QuickBite.food.entity.FoodItems;
import com.example.QuickBite.food.entity.InventoryHistory;
import com.example.QuickBite.food.repository.FoodRepository;
import com.example.QuickBite.food.repository.InventoryHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FoodService {

    private final FoodRepository foodRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;

    public FoodItems addFood(FoodItems foodItem) {
        if (foodItem == null) {
            throw new IllegalArgumentException("Food item details cannot be null");
        }
        applyAvailabilityRule(foodItem);
        FoodItems savedFoodItem = foodRepository.save(foodItem);
        recordInventoryHistory(savedFoodItem.getId(), savedFoodItem.getName(), 0, savedFoodItem.getQuantity());
        return savedFoodItem;
    }

    public FoodItems updateFood(Long id, FoodItems foodItem) {
        FoodItems existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));

        int oldQuantity = existingFood.getQuantity() != null ? existingFood.getQuantity() : 0;
        int newQuantity = foodItem.getQuantity() != null ? foodItem.getQuantity() : 0;

        existingFood.setName(foodItem.getName());
        existingFood.setDescription(foodItem.getDescription());
        existingFood.setPrice(foodItem.getPrice());
        existingFood.setCategory(foodItem.getCategory());
        existingFood.setQuantity(foodItem.getQuantity());
        existingFood.setImageUrl(foodItem.getImageUrl());

        applyAvailabilityRule(existingFood);
        FoodItems saved = foodRepository.save(existingFood);

        if (oldQuantity != saved.getQuantity()) {
            recordInventoryHistory(saved.getId(), saved.getName(), oldQuantity, saved.getQuantity());
        }
        return saved;
    }

    public void deleteFood(Long id) {
        FoodItems existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
        foodRepository.delete(existingFood);
    }


    public FoodItems getFoodById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
    }


    public List<FoodItems> getAllFoods() {
        return foodRepository.findAll();
    }


    public List<FoodItems> searchFood(String name) {
        return foodRepository.findByNameContainingIgnoreCase(name);
    }

    public List<FoodItems> searchByPrice(Double price) {
        return foodRepository.findByPrice(price);
    }


    public List<FoodItems> getFoodsByCategory(String category) {
        return foodRepository.findByCategoryIgnoreCase(category);
    }

    public FoodItems updateStock(Long id, Integer quantity) {
        FoodItems existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));

        int oldQuantity = existingFood.getQuantity() != null ? existingFood.getQuantity() : 0;

        existingFood.setQuantity(quantity);
        applyAvailabilityRule(existingFood);
        FoodItems saved = foodRepository.save(existingFood);

        if (oldQuantity != saved.getQuantity()) {
            recordInventoryHistory(saved.getId(), saved.getName(), oldQuantity, saved.getQuantity());
        }
        return saved;
    }

    // Enhancement feature implementations


    public List<FoodItems> getLowStockFoods() {
        return foodRepository.findByQuantityLessThan(5);
    }


    public List<FoodItems> getAvailableFoods() {
        return foodRepository.findByAvailableTrue();
    }


    public List<FoodItems> getOutOfStockFoods() {
        return foodRepository.findOutOfStockFoods();
    }


    public List<FoodItems> getFoodsInPriceRange(Double min, Double max) {
        return foodRepository.findByPriceBetweenAndAvailableTrue(min, max);
    }


    public List<FoodItems> getAllFoodsSortedByPriceAsc() {
        return foodRepository.findByAvailableTrueOrderByPriceAsc();
    }

    public List<FoodItems> getAllFoodsSortedByPriceDesc() {
        return foodRepository.findByAvailableTrueOrderByPriceDesc();
    }


    public Page<FoodItems> getFoodsPaginated(int page, int size) {
        return foodRepository.findAll(PageRequest.of(page, size));
    }


    public List<InventoryHistory> getInventoryHistory(Long foodId) {
        return inventoryHistoryRepository.findByFoodIdOrderByUpdateTimestampDesc(foodId);
    }

    private void recordInventoryHistory(Long foodId, String foodName, Integer oldQuantity, Integer newQuantity) {
        InventoryHistory history = InventoryHistory.builder()
                .foodId(foodId)
                .foodName(foodName)
                .oldQuantity(oldQuantity)
                .newQuantity(newQuantity)
                .updateTimestamp(LocalDateTime.now())
                .build();
        inventoryHistoryRepository.save(history);
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
