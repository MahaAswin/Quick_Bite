package com.example.QuickBite.order.service;

import com.example.QuickBite.enums.OrderStatus;
import com.example.QuickBite.order.dto.OrderResponseDTO;
import com.example.QuickBite.order.dto.PlaceOrderRequestDTO;
import com.example.QuickBite.order.entity.Order;
import com.example.QuickBite.order.repository.OrderItemRepository;
import com.example.QuickBite.order.repository.OrderRepository;
import com.example.QuickBite.user.entity.User;
import com.example.QuickBite.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;


    @Override
    public OrderResponseDTO placeOrder(PlaceOrderRequestDTO request) {
        return null;
    }


    @Override
    public List<OrderResponseDTO> getUserOrders() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        System.out.println("EMAIL FROM TOKEN = " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found!"));

        System.out.println("DB USER ID = " + user.getId());

        List<Order> orders = orderRepository.findByUser(user);

        return orders.stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public OrderResponseDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Order Not Found!")
                );
        return mapToResponseDTO(order);
    }



    @Override
    public OrderResponseDTO updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(
                        ()-> new RuntimeException("Order Not Found!")
                );
        order.setOrderStatus(status);
        Order updateOrder = orderRepository.save(order);
        return mapToResponseDTO(updateOrder);
    }

    @Override
    public String generateToken() {
        long count = orderRepository.count();
        return "TK" + (count + 1);
    }

    private OrderResponseDTO mapToResponseDTO(Order order) {
        return OrderResponseDTO
                .builder()
                .id(order.getId())
                .status(order.getOrderStatus())
                .tokenNumber(order.getTokenNumber())
                .totalAmount(order.getTotalAmount())
                .build();
    }

}