package com.example.QuickBite.dashboard.service;

import com.example.QuickBite.dashboard.dto.AdminDashboardResponse;
import com.example.QuickBite.dashboard.dto.ProfileResponse;
import com.example.QuickBite.dashboard.dto.UpdateProfileRequest;
import com.example.QuickBite.dashboard.dto.UserDashboardResponse;
import com.example.QuickBite.enums.OrderStatus;
import com.example.QuickBite.enums.Roles;
import com.example.QuickBite.order.repository.OrderRepository;
import com.example.QuickBite.user.entity.User;
import com.example.QuickBite.user.repository.UserRepository;
import org.springframework.boot.security.autoconfigure.SecurityProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImp implements DashboardService{

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public DashboardServiceImp(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public ProfileResponse getProfile() {
        Authentication authentication=
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email=authentication.getName();

        User user =userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not Found"));

        return new ProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
    @Override
    public AdminDashboardResponse getAdminDashboard(){
        long totalUsers=userRepository.countByRole(Roles.USER);
        long totalAdmins=userRepository.countByRole(Roles.ADMIN);
        long totalAccount=userRepository.count();
        long totalOrder=orderRepository.count();
        long pendingOrder=orderRepository.countByOrderStatus(OrderStatus.PENDING);
        long completedOrder=orderRepository.countByOrderStatus(OrderStatus.COMPLETED);
        return new AdminDashboardResponse(totalUsers,totalAdmins,totalAccount,totalOrder,pendingOrder,completedOrder);
    }

    public UserDashboardResponse getUserDashboard(){
        Authentication authentication=
                SecurityContextHolder.getContext().getAuthentication();

        String email=authentication.getName();
        User user =userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not Found"));

        return new UserDashboardResponse(
                user.getName(),
                user.getEmail(),
                user.getPhoneNo()
        );
    }

    @Override
    public void updateProfile(UpdateProfileRequest request) {
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        String email=authentication.getName();
        User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not Found"));

        user.setName(request.getName());
        user.setPhoneNo(request.getPhoneNo());
        userRepository.save(user);
    }
}
