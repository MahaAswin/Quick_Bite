package com.example.QuickBite.food.repository;

import com.example.QuickBite.food.entity.InventoryHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryHistoryRepository extends JpaRepository<InventoryHistory, Long> {

    List<InventoryHistory> findByFoodIdOrderByUpdateTimestampDesc(Long foodId);
}
