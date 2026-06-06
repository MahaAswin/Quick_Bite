package com.example.QuickBite.food.controller;

import com.example.QuickBite.food.dto.StockUpdateRequest;
import com.example.QuickBite.food.entity.FoodItem;
import com.example.QuickBite.food.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoods() {
        return ResponseEntity.ok(foodService.getAllFoods());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodById(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getFoodById(id));
    }

    @PostMapping
    public ResponseEntity<FoodItem> addFood(@Valid @RequestBody FoodItem foodItem) {
        FoodItem savedFoodItem = foodService.addFood(foodItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFoodItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodItem> updateFood(@PathVariable Long id, @Valid @RequestBody FoodItem foodItem) {
        return ResponseEntity.ok(foodService.updateFood(id, foodItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok("Food item deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodItem>> searchFood(@RequestParam String name) {
        return ResponseEntity.ok(foodService.searchFood(name));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodItem>> getFoodsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(foodService.getFoodsByCategory(category));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<FoodItem> updateStock(
            @PathVariable Long id,
            @RequestParam(required = false) Integer quantity,
            @RequestBody(required = false) StockUpdateRequest stockUpdateRequest) {

        Integer finalQuantity = null;
        if (quantity != null) {
            finalQuantity = quantity;
        } else if (stockUpdateRequest != null) {
            finalQuantity = stockUpdateRequest.getQuantity();
        }

        if (finalQuantity == null) {
            throw new IllegalArgumentException("Quantity must be provided either as a request parameter or in the request body");
        }

        return ResponseEntity.ok(foodService.updateStock(id, finalQuantity));
    }
}
