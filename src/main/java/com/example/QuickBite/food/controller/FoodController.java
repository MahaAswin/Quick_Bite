package com.example.QuickBite.food.controller;

import com.example.QuickBite.food.dto.StockUpdateRequest;
import com.example.QuickBite.food.entity.FoodItems;
import com.example.QuickBite.food.entity.InventoryHistory;
import com.example.QuickBite.food.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<FoodItems> getFoodById(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getFoodById(id));
    }

    @PostMapping("/admin")
    public ResponseEntity<FoodItems> addFood(@Valid @RequestBody FoodItems foodItem) {
        FoodItems savedFoodItem = foodService.addFood(foodItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFoodItem);
    }

    @PutMapping("/admin/{id:\\d+}")
    public ResponseEntity<FoodItems> updateFood(@PathVariable Long id, @Valid @RequestBody FoodItems foodItem) {
        return ResponseEntity.ok(foodService.updateFood(id, foodItem));
    }

    @DeleteMapping("/admin/{id:\\d+}")
    public ResponseEntity<String> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok("Food item deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodItems>> searchFood(@RequestParam String name) {
        return ResponseEntity.ok(foodService.searchFood(name));
    }

    @GetMapping("/searchByPrice")
    public ResponseEntity<List<FoodItems>> searchByPrice(@RequestParam Double price) {
        return ResponseEntity.ok(foodService.searchByPrice(price));
    }


    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodItems>> getFoodsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(foodService.getFoodsByCategory(category));
    }

    @PutMapping("/admin/{id:\\d+}/stock")
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


    // New Enhancement Endpoints

    @GetMapping("/admin/low-stock")
    public ResponseEntity<List<FoodItems>> getLowStockFoods() {
        return ResponseEntity.ok(foodService.getLowStockFoods());
    }

    @GetMapping("/admin/available")
    public ResponseEntity<List<FoodItems>> getAvailableFoods() {
        return ResponseEntity.ok(foodService.getAvailableFoods());
    }

    @GetMapping("/admin/out-of-stock")
    public ResponseEntity<List<FoodItems>> getOutOfStockFoods() {
        return ResponseEntity.ok(foodService.getOutOfStockFoods());
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<FoodItems>> getFoodsInPriceRange(
            @RequestParam Double min,
            @RequestParam Double max) {
        return ResponseEntity.ok(foodService.getFoodsInPriceRange(min, max));
    }

    @GetMapping("/sort/price-asc")
    public ResponseEntity<List<FoodItems>> getFoodsSortedByPriceAsc() {
        return ResponseEntity.ok(foodService.getAllFoodsSortedByPriceAsc());
    }

    @GetMapping("/sort/price-desc")
    public ResponseEntity<List<FoodItems>> getFoodsSortedByPriceDesc() {
        return ResponseEntity.ok(foodService.getAllFoodsSortedByPriceDesc());
    }

    @GetMapping("/admin/page")
    public ResponseEntity<Page<FoodItems>> getFoodsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(foodService.getFoodsPaginated(page, size));
    }

    @GetMapping("/admin/history/{id:\\d+}")
    public ResponseEntity<List<InventoryHistory>> getInventoryHistory(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getInventoryHistory(id));
    }
}
