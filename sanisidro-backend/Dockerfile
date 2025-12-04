FROM eclipse-temurin:21-jdk

# Copia el jar generado
COPY target/*.jar app.jar

# Puerto expuesto
EXPOSE 8080

# Comando de inicio
ENTRYPOINT ["java","-jar","/app.jar"]