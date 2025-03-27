<script lang="ts">
    import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';

    let { startDate = $bindable(), endDate = $bindable(), onDateRangeSelected }: {
        startDate: Date,
        endDate: Date,
        onDateRangeSelected: Function,
    } = $props()
    
    // Calendar state
    let rightMonth = $state(new Date());
    
    // Preset ranges
    const presets = [
        { label: 'Ultimos 7 Dias', value: 'last7days' },
        { label: 'Ultimos 15 Dias', value: 'last15days' },
        { label: 'Ultimos 30 Dias', value: 'last30days' },
        { label: 'Ultimos 12 Meses', value: 'last12months' },
        { label: 'Mes Actual', value: 'monthToDate' },
        { label: 'Todas las Asistencias', value: 'allTime' },
        { label: 'Personalizado', value: 'custom' }
    ];
    
    let selectedPreset = $state('last7days');
    
    // Date formatting
    function formatDate(date) {
        if (!date) return '';
        return date.toLocaleDateString('es-VE', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');
    }
    
    // Input fields
    let startDateInput = $state(formatDate(startDate));
    let endDateInput = $state(formatDate(endDate));
    
    $effect(() => {
        startDateInput = formatDate(startDate);
        endDateInput = formatDate(endDate);
    });
    

    function previousRightMonth() {
        rightMonth = new Date(rightMonth.getFullYear(), rightMonth.getMonth() - 1);
    }
    
    function nextRightMonth() {
        rightMonth = new Date(rightMonth.getFullYear(), rightMonth.getMonth() + 1);
    }
    
    
    // Calendar generation
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    
    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    }
    
    function generateCalendarDays(year, month) {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        
        // Previous month days to display
        const daysInPrevMonth = month === 0 
            ? getDaysInMonth(year - 1, 11) 
            : getDaysInMonth(year, month - 1);
        
        let days = [];
        
        // Add previous month days
        for (let i = 0; i < firstDay; i++) {
            const prevDay = daysInPrevMonth - firstDay + i + 1;
            const prevMonth = month === 0 ? 11 : month - 1;
            const prevYear = month === 0 ? year - 1 : year;
            
            days.push({
                day: prevDay,
                month: prevMonth,
                year: prevYear,
                isCurrentMonth: false,
                date: new Date(prevYear, prevMonth, prevDay)
            });
        }
        
        // Add current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                month: month,
                year: year,
                isCurrentMonth: true,
                date: new Date(year, month, i)
            });
        }
        
        // Add next month days to fill the grid (6 rows of 7 days)
        const totalDays = 42; // 6 rows * 7 days
        const remainingDays = totalDays - days.length;
        
        for (let i = 1; i <= remainingDays; i++) {
            const nextMonth = month === 11 ? 0 : month + 1;
            const nextYear = month === 11 ? year + 1 : year;
            
            days.push({
                day: i,
                month: nextMonth,
                year: nextYear,
                isCurrentMonth: false,
                date: new Date(nextYear, nextMonth, i)
            });
        }
        
        return days;
    }
    
    // Date selection
    function isDateInRange(date) {
        return date >= startDate && date <= endDate;
    }
    
    function isStartDate(date) {
        return date.getDate() === startDate.getDate() &&
               date.getMonth() === startDate.getMonth() &&
               date.getFullYear() === startDate.getFullYear();
    }
    
    function isEndDate(date) {
        return date.getDate() === endDate.getDate() &&
               date.getMonth() === endDate.getMonth() &&
               date.getFullYear() === endDate.getFullYear();
    }
    
    function selectDate(date) {
        if (!startDate || (startDate && endDate)) {
            // Start new range
            startDate = date;
            endDate = date;
        } else {
            // Complete range
            if (date < startDate) {
                endDate = startDate;
                startDate = date;
            } else {
                endDate = date;
            }
        }
        selectedPreset = 'custom';
        dispatchEvent(startDate, endDate)
    }
    
    // Apply preset ranges
    function applyPreset(preset) {
        selectedPreset = preset;
        const today = new Date();
        
        switch (preset) {
            case 'last7days':
                endDate = new Date();
                startDate = new Date();
                startDate.setDate(today.getDate() - 6);
                dispatchEvent(startDate, endDate)
                break;
            case 'last15days':
                endDate = new Date();
                startDate = new Date();
                startDate.setDate(today.getDate() - 14);
                dispatchEvent(startDate, endDate)
                break;
            case 'last30days':
                endDate = new Date();
                startDate = new Date();
                startDate.setDate(today.getDate() - 29);
                dispatchEvent(startDate, endDate)
                break;
            case 'last12months':
                endDate = new Date();
                startDate = new Date();
                startDate.setFullYear(today.getFullYear() - 1);
                startDate.setDate(startDate.getDate() + 1);
                dispatchEvent(startDate, endDate)
                break;
            case 'monthToDate':
                endDate = new Date();
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                dispatchEvent(startDate, endDate)
                break;
            case 'allTime':
                endDate = new Date();
                startDate = new Date(2000, 0, 1); // Set some arbitrary past date
                dispatchEvent(startDate, endDate)
                break;
        }
        
        // Update the inputs
        startDateInput = formatDate(startDate);
        endDateInput = formatDate(endDate);
    }

    function dispatchEvent(startDate: Date, endDate: Date) {
        onDateRangeSelected({
            detail: {
                startDate: startDate,
                endDate: endDate,
            }
        })
    }
</script>

<div class="date-range-picker 
            w-full z-50 border border-base-content/20
            bg-base-100 rounded-lg shadow-xl overflow-hidden
            text-xs">
    <div class="flex">
        <!-- Presets sidebar -->
        <div class="preset-sidebar bg-base-100 border-r border-base-300 p-2">
            <ul class="space-y-1">
                {#each presets as preset}
                    <li>
                        <button 
                            class="w-full text-left py-2 px-4 rounded-md transition-colors duration-200
                                    {selectedPreset === preset.value ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}"
                                onclick={() => applyPreset(preset.value)}>
                            {preset.label}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
        
        <!-- Calendar view -->
        <div class="calendar-container grid grid-cols-1 gap-2 p-4">
            <!-- Right Month -->
            <div class="month-calendar">
                <div class="flex items-center justify-between mb-4">
                    <button class="btn btn-sm btn-circle" onclick={previousRightMonth}>
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <h3 class="text-lg font-medium">
                        {capitalizeFirstLetter(rightMonth.toLocaleDateString('es', { month: 'long', year: 'numeric' }))}
                    </h3>
                    <button class="btn btn-sm btn-circle" onclick={nextRightMonth}>
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
                
                {#key null}
                    <div class="grid grid-cols-7 gap-1">
                        <!-- Week days -->
                        {#each ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'] as day}
                            <div class="text-center text-sm font-medium text-base-content/70 py-1">{day}</div>
                        {/each}
                        
                        <!-- Days -->
                        {#each generateCalendarDays(rightMonth.getFullYear(), rightMonth.getMonth()) as { day, isCurrentMonth, date }}
                            <button 
                                class="day-cell size-4 p-4 rounded-md flex items-center justify-center text-sm
                                    {!isCurrentMonth ? 'animate-pop text-base-content/30' : ""}
                                    {isDateInRange(date) ? 'animate-pop bg-primary text-primary-content' : 'hover:bg-base-200'}
                                    {isStartDate(date) ? 'animate-pop bg-primary rounded-l-md' : ''}
                                    {isEndDate(date) ? 'animate-pop bg-primary rounded-r-md' : ''}"
                                onclick={() => selectDate(date)}>
                                {day}
                            </button>
                        {/each}
                    </div>
                {/key}
            </div>
        </div>
    </div>
</div>

<style>
    .calendar-container {
        width: 60%;
    }
    
    .preset-sidebar {
        width: 40%;
    }
</style> 