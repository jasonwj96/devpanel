package com.credicorp.devpanel.service;

import com.credicorp.devpanel.dto.DashboardMetricsDTO;
import com.credicorp.devpanel.dto.PageResponse;
import com.credicorp.devpanel.dto.UserDTO;
import com.credicorp.devpanel.entity.User;
import com.credicorp.devpanel.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public PageResponse<UserDTO> search(String search, int page, int size) {
        int safeSize = Math.min(Math.max(size, 1), 100);
        int safePage = Math.max(page, 0);

        Page<User> result = userRepository.search(
                search,
                PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        Page<UserDTO> dtoPage = result.map(UserDTO::from);
        return PageResponse.from(dtoPage);
    }

    public DashboardMetricsDTO metrics() {
        long total = userRepository.count();
        long active = userRepository.countByStatus(User.Status.ACTIVE);
        long inactive = userRepository.countByStatus(User.Status.INACTIVE);
        long adminCount = userRepository.countByRole(User.Role.ADMIN);
        return new DashboardMetricsDTO(total, active, inactive, adminCount);
    }
}
