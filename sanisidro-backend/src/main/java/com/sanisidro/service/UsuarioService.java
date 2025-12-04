package com.sanisidro.service;

import com.sanisidro.model.Usuario;
import com.sanisidro.repository.UsuarioRepository;
import com.sanisidro.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    public List<Usuario> obtenerTodos() {
        System.out.println("=== OBTENIENDO USUARIOS CON CONTEO DE PEDIDOS ===");
        List<Usuario> usuarios = usuarioRepository.findAll();
        System.out.println("Total usuarios encontrados: " + usuarios.size());
        
        // Calcular el número de pedidos para cada usuario
        usuarios.forEach(usuario -> {
            int numeroPedidos = pedidoRepository.findByEmail(usuario.getEmail()).size();
            System.out.println("Usuario: " + usuario.getEmail() + " - Pedidos: " + numeroPedidos);
            usuario.setPedidos(numeroPedidos);
        });
        System.out.println("=================================================");
        return usuarios;
    }
    
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }
    
    public Optional<Usuario> obtenerPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    
    public Usuario registrar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    
    public Usuario actualizar(Long id, Usuario usuarioActualizado) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setEmail(usuarioActualizado.getEmail());
            usuario.setTelefono(usuarioActualizado.getTelefono());
            if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
                usuario.setPassword(usuarioActualizado.getPassword());
            }
            usuario.setActivo(usuarioActualizado.getActivo());
            return usuarioRepository.save(usuario);
        }
        return null;
    }
    
    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }
    
    public Usuario login(String email, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isPresent() && usuario.get().getPassword().equals(password)) {
            return usuario.get();
        }
        return null;
    }
}
