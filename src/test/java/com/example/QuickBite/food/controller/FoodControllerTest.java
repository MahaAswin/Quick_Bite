package com.example.QuickBite.food.controller;

import com.example.QuickBite.food.entity.FoodItems;
import com.example.QuickBite.food.entity.InventoryHistory;
import com.example.QuickBite.food.service.FoodService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class FoodControllerTest {

    private MockMvc mockMvc;

    @Mock
    private FoodService foodService;

    @InjectMocks
    private FoodController foodController;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private FoodItems foodItem;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(foodController).build();

        foodItem = FoodItems.builder()
                .id(1L)
                .name("Dosa")
                .description("South Indian Dosa")
                .price(60.0)
                .category("Breakfast")
                .quantity(10)
                .available(true)
                .imageUrl("dosa.jpg")
                .build();
    }

    @Test
    void testGetAllFoods() throws Exception {
        when(foodService.getAllFoods()).thenReturn(Collections.singletonList(foodItem));

        mockMvc.perform(get("/foods"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Dosa"))
                .andExpect(jsonPath("$[0].price").value(60.0));
    }

    @Test
    void testGetFoodById() throws Exception {
        when(foodService.getFoodById(1L)).thenReturn(foodItem);

        mockMvc.perform(get("/foods/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Dosa"));
    }

    @Test
    void testAddFood() throws Exception {
        when(foodService.addFood(any(FoodItems.class))).thenReturn(foodItem);

        mockMvc.perform(post("/foods/admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(foodItem)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Dosa"));
    }

    @Test
    void testDeleteFood() throws Exception {
        doNothing().when(foodService).deleteFood(1L);

        mockMvc.perform(delete("/foods/admin/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Food item deleted successfully"));
    }

    @Test
    void testSearchFood() throws Exception {
        when(foodService.searchFood("dosa")).thenReturn(Collections.singletonList(foodItem));

        mockMvc.perform(get("/foods/search").param("name", "dosa"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Dosa"));
    }

    @Test
    void testGetFoodsByCategory() throws Exception {
        when(foodService.getFoodsByCategory("Breakfast")).thenReturn(Collections.singletonList(foodItem));

        mockMvc.perform(get("/foods/category/Breakfast"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Breakfast"));
    }

    @Test
    void testUpdateStock_viaParam() throws Exception {
        foodItem.setQuantity(20);
        when(foodService.updateStock(1L, 20)).thenReturn(foodItem);

        mockMvc.perform(put("/foods/admin/1/stock").param("quantity", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(20));
    }

    @Test
    void testGetLowStockFoods() throws Exception {
        when(foodService.getLowStockFoods()).thenReturn(Collections.singletonList(foodItem));

        mockMvc.perform(get("/foods/low-stock"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Dosa"));
    }

    @Test
    void testGetAvailableFoods() throws Exception {
        when(foodService.getAvailableFoods()).thenReturn(Collections.singletonList(foodItem));

        mockMvc.perform(get("/foods/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Dosa"));
    }

    @Test
    void testGetOutOfStockFoods() throws Exception {
        when(foodService.getOutOfStockFoods()).thenReturn(Collections.singletonList(foodItem));

        mockMvc.perform(get("/foods/out-of-stock"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Dosa"));
    }

    @Test
    void testGetFoodsInPriceRange() throws Exception {
        when(foodService.getFoodsInPriceRange(50.0, 100.0)).thenReturn(Collections.singletonList(foodItem));

        mockMvc.perform(get("/foods/price-range").param("min", "50").param("max", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Dosa"));
    }

    @Test
    void testGetFoodsSortedByPriceAsc() throws Exception {
        when(foodService.getAllFoodsSortedByPriceAsc()).thenReturn(Collections.singletonList(foodItem));

        mockMvc.perform(get("/foods/sort/price-asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Dosa"));
    }

    @Test
    void testGetFoodsSortedByPriceDesc() throws Exception {
        when(foodService.getAllFoodsSortedByPriceDesc()).thenReturn(Collections.singletonList(foodItem));

        mockMvc.perform(get("/foods/sort/price-desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Dosa"));
    }

    @Test
    void testGetFoodsPaginated() throws Exception {
        Page<FoodItems> page = new PageImpl<>(Collections.singletonList(foodItem), PageRequest.of(0, 10), 1);
        when(foodService.getFoodsPaginated(0, 10)).thenReturn(page);

        mockMvc.perform(get("/foods/page").param("page", "0").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Dosa"));
    }

    @Test
    void testGetInventoryHistory() throws Exception {
        InventoryHistory history = InventoryHistory.builder()
                .id(1L)
                .foodId(1L)
                .foodName("Dosa")
                .oldQuantity(0)
                .newQuantity(10)
                .build();
        when(foodService.getInventoryHistory(1L)).thenReturn(Collections.singletonList(history));

        mockMvc.perform(get("/foods/history/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].foodName").value("Dosa"));
    }
}
