FROM openjdk:21-jdk-slim

# Copia el jar generado
COPY target/*.jar app.jar

# Puerto expuesto
EXPOSE 8080

# Comando de inicio
ENTRYPOINT ["java","-jar","/app.jar"]