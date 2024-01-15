total_utilization=0

for ((i=0; i<500; i++)); do
    utilization=$(nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits)
    
    # Remove any leading or trailing whitespace
    #utilization=$(echo "$utilization" | tr -d '[:space:]')
    
    # Cast the string to an integer
    #utilization=$(printf "%.0f" "$utilization")

    total_utilization=$((total_utilization + utilization))
    
    echo "Iteration $((i + 1)) - GPU Utilization: $utilization%"
    
    sleep 0.01
done

average_utilization=$((total_utilization / 500))
echo "Average GPU Utilization: $average_utilization%"
