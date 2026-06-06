package com.example.QuickBite.food.service;

import com.example.QuickBite.food.entity.FoodItem;
import com.example.QuickBite.food.repository.FoodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FoodServiceImpTest {

    @Mock
    private FoodRepository foodRepository;

    @InjectMocks
    private FoodServiceImp foodService;

    private FoodItem foodItem;

    @BeforeEach
    void setUp() {
        foodItem = FoodItem.builder()
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
        when(foodRepository.save(any(FoodItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FoodItem result = foodService.addFood(foodItem);

        assertNotNull(result);
        assertTrue(result.getAvailable());
        verify(foodRepository, times(1)).save(foodItem);
    }

    @Test
    void testAddFood_withZeroStock() {
        foodItem.setQuantity(0);
        when(foodRepository.save(any(FoodItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FoodItem result = foodService.addFood(foodItem);

        assertNotNull(result);
        assertFalse(result.getAvailable());
    }

    @Test
    void testUpdateStock_toZero() {
        when(foodRepository.findById(1L)).thenReturn(Optional.of(foodItem));
        when(foodRepository.save(any(FoodItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FoodItem result = foodService.updateStock(1L, 0);

        assertNotNull(result);
        assertEquals(0, result.getQuantity());
        assertFalse(result.getAvailable());
    }

    @Test
    void testUpdateStock_toPositive() {
        foodItem.setQuantity(0);
        foodItem.setAvailable(false);
        when(foodRepository.findById(1L)).thenReturn(Optional.of(foodItem));
        when(foodRepository.save(any(FoodItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FoodItem result = foodService.updateStock(1L, 5);

        assertNotNull(result);
        assertEquals(5, result.getQuantity());
        assertTrue(result.getAvailable());
    }
}
