# Configuration

- routing key contains: {unique_app_name}.{app_component}.{message_type}.{user_id}.{group_id}
- subscribers can subscribe to routing keys - same approach as topic subscriptions in rabbitmq (concrete RK part value, *, #) - the list of possible subscription keys are configured for the user in UDM
