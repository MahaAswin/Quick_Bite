package com.example.QuickBite.food.controller;

import com.example.QuickBite.food.dto.StockUpdateRequest;
import com.example.QuickBite.food.entity.FoodItems;
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
    public ResponseEntity<List<FoodItems>> getAllFoods() {
        return ResponseEntity.ok(foodService.getAllFoods());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItems> getFoodById(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getFoodById(id));
    }

    @PostMapping
    public ResponseEntity<FoodItems> addFood(@Valid @RequestBody FoodItems foodItem) {
        FoodItems savedFoodItem = foodService.addFood(foodItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFoodItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodItems> updateFood(@PathVariable Long id, @Valid @RequestBody FoodItems foodItem) {
        return ResponseEntity.ok(foodService.updateFood(id, foodItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok("Food item deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodItems>> searchFood(@RequestParam String name) {
        return ResponseEntity.ok(foodService.searchFood(name));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodItems>> getFoodsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(foodService.getFoodsByCategory(category));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<FoodItems> updateStock(
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
