package com.example.QuickBite.food.service;

import com.example.QuickBite.food.entity.FoodItems;
import com.example.QuickBite.food.entity.InventoryHistory;
import com.example.QuickBite.food.repository.FoodRepository;
import com.example.QuickBite.food.repository.InventoryHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FoodServiceTest {

    @Mock
    private FoodRepository foodRepository;

    @Mock
    private InventoryHistoryRepository inventoryHistoryRepository;

    @InjectMocks
    private FoodService foodService;

    private FoodItems foodItem;

    @BeforeEach
    void setUp() {
        foodItem = FoodItems.builder()
                .id(1L)
                .name("Dosa")
                .description("Delicious South Indian Dosa")
                .price(60.0)
                .category("Breakfast")
                .quantity(10)
                .available(true)
                .imageUrl("dosa.jpg")
                .build();
    }

    @Test
    void testAddFood_withStock() {
        when(foodRepository.save(any(FoodItems.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FoodItems result = foodService.addFood(foodItem);

        assertNotNull(result);
        assertTrue(result.getAvailable());
        verify(foodRepository, times(1)).save(foodItem);
        verify(inventoryHistoryRepository, times(1)).save(any(InventoryHistory.class));
    }

    @Test
    void testAddFood_withZeroStock() {
        foodItem.setQuantity(0);
        when(foodRepository.save(any(FoodItems.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FoodItems result = foodService.addFood(foodItem);

        assertNotNull(result);
        assertFalse(result.getAvailable());
        verify(inventoryHistoryRepository, times(1)).save(any(InventoryHistory.class));
    }

    @Test
    void testUpdateStock_toZero() {
        when(foodRepository.findById(1L)).thenReturn(Optional.of(foodItem));
        when(foodRepository.save(any(FoodItems.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FoodItems result = foodService.updateStock(1L, 0);

        assertNotNull(result);
        assertEquals(0, result.getQuantity());
        assertFalse(result.getAvailable());
        verify(inventoryHistoryRepository, times(1)).save(any(InventoryHistory.class));
    }

    @Test
    void testUpdateStock_toPositive() {
        foodItem.setQuantity(0);
        foodItem.setAvailable(false);
        when(foodRepository.findById(1L)).thenReturn(Optional.of(foodItem));
        when(foodRepository.save(any(FoodItems.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FoodItems result = foodService.updateStock(1L, 5);

        assertNotNull(result);
        assertEquals(5, result.getQuantity());
        assertTrue(result.getAvailable());
        verify(inventoryHistoryRepository, times(1)).save(any(InventoryHistory.class));
    }

    @Test
    void testGetLowStockFoods() {
        when(foodRepository.findByQuantityLessThan(5)).thenReturn(Collections.singletonList(foodItem));
        List<FoodItems> result = foodService.getLowStockFoods();
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        verify(foodRepository, times(1)).findByQuantityLessThan(5);
    }

    @Test
    void testGetAvailableFoods() {
        when(foodRepository.findByAvailableTrue()).thenReturn(Collections.singletonList(foodItem));
        List<FoodItems> result = foodService.getAvailableFoods();
        assertFalse(result.isEmpty());
        assertTrue(result.get(0).getAvailable());
        verify(foodRepository, times(1)).findByAvailableTrue();
    }

    @Test
    void testGetOutOfStockFoods() {
        foodItem.setQuantity(0);
        foodItem.setAvailable(false);
        when(foodRepository.findOutOfStockFoods()).thenReturn(Collections.singletonList(foodItem));
        List<FoodItems> result = foodService.getOutOfStockFoods();
        assertFalse(result.isEmpty());
        assertFalse(result.get(0).getAvailable());
        verify(foodRepository, times(1)).findOutOfStockFoods();
    }

    @Test
    void testGetFoodsInPriceRange() {
        when(foodRepository.findByPriceBetweenAndAvailableTrue(50.0, 100.0))
                .thenReturn(Collections.singletonList(foodItem));

        List<FoodItems> result = foodService.getFoodsInPriceRange(50.0, 100.0);

        assertFalse(result.isEmpty());

        verify(foodRepository, times(1))
                .findByPriceBetweenAndAvailableTrue(50.0, 100.0);
    }

    @Test
    void testGetAllFoodsSortedByPriceAsc() {
        when(foodRepository.findAll(any(Sort.class))).thenReturn(Collections.singletonList(foodItem));
        List<FoodItems> result = foodService.getAllFoodsSortedByPriceAsc();
        assertFalse(result.isEmpty());
        verify(foodRepository, times(1)).findAll(any(Sort.class));
    }

    @Test
    void testGetAllFoodsSortedByPriceDesc() {
        when(foodRepository.findAll(any(Sort.class))).thenReturn(Collections.singletonList(foodItem));
        List<FoodItems> result = foodService.getAllFoodsSortedByPriceDesc();
        assertFalse(result.isEmpty());
        verify(foodRepository, times(1)).findAll(any(Sort.class));
    }

    @Test
    void testGetFoodsPaginated() {
        Page<FoodItems> page = new PageImpl<>(Collections.singletonList(foodItem));
        when(foodRepository.findAll(any(PageRequest.class))).thenReturn(page);
        Page<FoodItems> result = foodService.getFoodsPaginated(0, 10);
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(foodRepository, times(1)).findAll(any(PageRequest.class));
    }

    @Test
    void testGetInventoryHistory() {
        InventoryHistory history = InventoryHistory.builder()
                .id(1L)
                .foodId(1L)
                .foodName("Dosa")
                .oldQuantity(0)
                .newQuantity(10)
                .build();
        when(inventoryHistoryRepository.findByFoodIdOrderByUpdateTimestampDesc(1L))
                .thenReturn(Collections.singletonList(history));

        List<InventoryHistory> result = foodService.getInventoryHistory(1L);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        verify(inventoryHistoryRepository, times(1)).findByFoodIdOrderByUpdateTimestampDesc(1L);
    }
}
