<script setup lang="ts">
import AdminField from '~/components/admin/AdminField.vue'
import type { AdminCarPayload, Car, HomeCategory, VehicleType } from '~/types/car'

interface Dictionaries {
  brands: string[]
  models: string[]
  cities: string[]
  fuels: string[]
  transmissions: string[]
  drivetrains: string[]
  colors: string[]
  categories: HomeCategory[]
  vehicleTypes: VehicleType[]
}

const props = defineProps<{
  dictionaries: Dictionaries
  initialCar?: Car
  submitLabel?: string
}>()

const emit = defineEmits<{
  created: [id: string]
  saved: [id: string]
}>()

const isSubmitting = ref(false)
const isUploadingImages = ref(false)
const errorMessage = ref('')
const imageText = ref('')
const { adminFetch } = useAdminApi()
const { showSuccess, showError } = useAdminToast()

const createEmptyForm = (): AdminCarPayload => ({
  brand: '',
  model: '',
  title: '',
  price: 0,
  year: new Date().getFullYear(),
  mileage: 0,
  fuel: '',
  transmission: '',
  city: 'Бишкек',
  engine: '',
  drivetrain: '',
  power: 0,
  color: '',
  description: '',
  sellerName: '',
  sellerType: 'Дилер',
  sellerPhone: '+996 ',
  images: [],
  isFeatured: false,
  isUrgent: false,
  categoryId: '',
  vehicleTypeId: ''
})

const carToPayload = (car: Car): AdminCarPayload => ({
  brand: car.brand,
  model: car.model,
  title: car.title,
  price: car.price,
  year: car.year,
  mileage: car.mileage,
  fuel: car.fuel,
  transmission: car.transmission,
  city: car.city,
  engine: car.engine,
  drivetrain: car.drivetrain,
  power: car.power,
  color: car.color,
  description: car.description,
  sellerName: car.seller.name,
  sellerType: car.seller.type,
  sellerPhone: car.seller.phone,
  images: [...car.images],
  isFeatured: car.isFeatured,
  isUrgent: Boolean(car.isUrgent),
  categoryId: car.categoryId ?? '',
  vehicleTypeId: car.vehicleTypeId ?? ''
})

const form = reactive<AdminCarPayload>(createEmptyForm())

watch(
  () => props.initialCar,
  (car) => {
    imageText.value = ''
    Object.assign(form, car ? carToPayload(car) : createEmptyForm())
  },
  { immediate: true }
)

const normalizedImages = computed(() =>
  [
    ...form.images,
    ...imageText.value
      .split('\n')
      .map((image) => image.trim())
      .filter(Boolean)
  ]
)

const mainImage = computed(() => normalizedImages.value[0] ?? '')

const uploadImages = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = [...(input.files ?? [])]

  if (!files.length) {
    return
  }

  isUploadingImages.value = true
  errorMessage.value = ''

  try {
    const formData = new FormData()

    for (const file of files) {
      formData.append('file', file)
    }

    formData.append('folder', 'cars')

    const response = await adminFetch<{ data: Array<{ path: string }> }>('/api/admin/uploads', {
      method: 'POST',
      body: formData
    })

    form.images = [
      ...form.images,
      ...response.data.map((file) => file.path).filter(Boolean)
    ]
    showSuccess('Фото загружены', `Добавлено файлов: ${response.data.length}.`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось загрузить фото'
    showError('Не удалось загрузить фото', errorMessage.value)
  } finally {
    input.value = ''
    isUploadingImages.value = false
  }
}

const removeImage = (image: string) => {
  form.images = form.images.filter((currentImage) => currentImage !== image)
}

const makeMainImage = (image: string) => {
  form.images = [
    image,
    ...form.images.filter((currentImage) => currentImage !== image)
  ]
}

const submit = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const response = await adminFetch<{ data: { id: string } }>(
      props.initialCar ? `/api/admin/cars/${props.initialCar.id}` : '/api/admin/cars',
      {
        method: props.initialCar ? 'PATCH' : 'POST',
        body: {
          ...form,
          images: normalizedImages.value
        }
      }
    )

    if (props.initialCar) {
      emit('saved', response.data.id)
    } else {
      emit('created', response.data.id)
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось сохранить автомобиль'
    showError('Не удалось сохранить автомобиль', errorMessage.value)
  } finally {
    isSubmitting.value = false
  }
}

const inputClass = 'focus-ring min-h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 placeholder:text-slate-400'
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit">
    <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-lg font-bold">Автомобиль</h2>

      <div class="mt-4 grid gap-4">
        <AdminField label="Марка" hint="Можно выбрать существующую или ввести новую. Например: Mercedes-Benz.">
          <input v-model.trim="form.brand" :class="inputClass" list="admin-brands" placeholder="Toyota" required>
          <datalist id="admin-brands">
            <option v-for="brand in props.dictionaries.brands" :key="brand" :value="brand" />
          </datalist>
        </AdminField>

        <AdminField label="Модель">
          <input v-model.trim="form.model" :class="inputClass" list="admin-models" placeholder="Camry" required>
          <datalist id="admin-models">
            <option v-for="model in props.dictionaries.models" :key="model" :value="model" />
          </datalist>
        </AdminField>

        <AdminField label="Название объявления">
          <input v-model.trim="form.title" :class="inputClass" placeholder="Toyota Camry 70, 2.5 AT">
        </AdminField>

        <div class="grid grid-cols-[minmax(0,1fr)_minmax(5.5rem,28%)] gap-3">
          <AdminField label="Цена, $" >
            <input v-model.number="form.price" :class="inputClass" inputmode="numeric" min="1" required type="number">
          </AdminField>

          <AdminField label="Год">
            <input v-model.number="form.year" :class="inputClass" inputmode="numeric" min="1980" required type="number">
          </AdminField>
        </div>

        <AdminField label="Пробег, км">
          <input v-model.number="form.mileage" :class="inputClass" inputmode="numeric" min="0" type="number">
        </AdminField>

        <AdminField label="Популярная категория" hint="Необязательно. Связь нужна для карточек на главной и быстрых подборок.">
          <select v-model="form.categoryId" :class="inputClass">
            <option value="">Без категории</option>
            <option v-for="category in props.dictionaries.categories" :key="category.id" :value="category.id">
              {{ category.title }}
            </option>
          </select>
        </AdminField>

        <AdminField label="Тип транспорта" hint="Необязательно. Если не выбрать, старые объявления продолжат определяться по тексту.">
          <select v-model="form.vehicleTypeId" :class="inputClass">
            <option value="">Без типа</option>
            <option v-for="type in props.dictionaries.vehicleTypes" :key="type.id" :value="type.id">
              {{ type.title }}
            </option>
          </select>
        </AdminField>
      </div>
    </section>

    <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-lg font-bold">Характеристики</h2>

      <div class="mt-4 grid gap-4">
        <AdminField label="Топливо">
          <input v-model.trim="form.fuel" :class="inputClass" list="admin-fuels" placeholder="Бензин">
          <datalist id="admin-fuels">
            <option v-for="fuel in props.dictionaries.fuels" :key="fuel" :value="fuel" />
          </datalist>
        </AdminField>

        <AdminField label="Коробка">
          <input v-model.trim="form.transmission" :class="inputClass" list="admin-transmissions" placeholder="Автомат">
          <datalist id="admin-transmissions">
            <option v-for="transmission in props.dictionaries.transmissions" :key="transmission" :value="transmission" />
          </datalist>
        </AdminField>

        <AdminField label="Привод">
          <input v-model.trim="form.drivetrain" :class="inputClass" list="admin-drivetrains" placeholder="Передний">
          <datalist id="admin-drivetrains">
            <option v-for="drivetrain in props.dictionaries.drivetrains" :key="drivetrain" :value="drivetrain" />
          </datalist>
        </AdminField>

        <AdminField label="Мощность">
          <input v-model.number="form.power" :class="inputClass" inputmode="numeric" min="0" type="number">
        </AdminField>

        <AdminField label="Двигатель">
          <input v-model.trim="form.engine" :class="inputClass" placeholder="2.5 л">
        </AdminField>

        <AdminField label="Цвет">
          <input v-model.trim="form.color" :class="inputClass" list="admin-colors" placeholder="Белый">
          <datalist id="admin-colors">
            <option v-for="color in props.dictionaries.colors" :key="color" :value="color" />
          </datalist>
        </AdminField>
      </div>
    </section>

    <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-lg font-bold">Локация и продавец</h2>

      <div class="mt-4 grid gap-4">
        <AdminField label="Город">
          <input v-model.trim="form.city" :class="inputClass" list="admin-cities" required>
          <datalist id="admin-cities">
            <option v-for="city in props.dictionaries.cities" :key="city" :value="city" />
          </datalist>
        </AdminField>

        <AdminField label="Продавец">
          <input v-model.trim="form.sellerName" :class="inputClass" placeholder="Название дилера или имя" required>
        </AdminField>

        <AdminField label="Тип продавца">
          <select v-model="form.sellerType" :class="inputClass">
            <option value="Дилер">Дилер</option>
            <option value="Частный продавец">Частный продавец</option>
          </select>
        </AdminField>

        <AdminField label="Телефон">
          <input v-model.trim="form.sellerPhone" :class="inputClass" inputmode="tel" placeholder="+996 555 000 000" required>
        </AdminField>

        <div class="grid grid-cols-2 gap-3">
          <label class="flex min-h-10 min-w-0 items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 text-sm font-bold text-slate-800">
            <span class="min-w-0 leading-4">Лучшее предложение</span>
            <input v-model="form.isFeatured" class="h-5 w-5 shrink-0 accent-emerald-600" type="checkbox">
          </label>

          <label class="flex min-h-10 min-w-0 items-center justify-between gap-3 rounded-lg bg-rose-50 px-3 text-sm font-bold text-rose-800">
            <span class="min-w-0 leading-4">Срочно</span>
            <input v-model="form.isUrgent" class="h-5 w-5 shrink-0 accent-rose-600" type="checkbox">
          </label>
        </div>
      </div>
    </section>

    <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-lg font-bold">Описание и фото</h2>

      <div class="mt-4 grid gap-4">
        <AdminField label="Описание">
          <textarea v-model.trim="form.description" class="focus-ring min-h-32 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400" placeholder="Кратко опишите состояние, комплектацию и историю." />
        </AdminField>

        <AdminField label="Фото">
          <div class="grid gap-3">
            <input
              accept="image/jpeg,image/png,image/webp,image/gif"
              class="text-sm font-bold text-slate-700"
              multiple
              type="file"
              @change="uploadImages"
            >

            <p v-if="isUploadingImages" class="rounded-lg bg-slate-50 p-3 text-sm font-bold text-slate-500">
              Загружаем фото...
            </p>

            <div v-if="form.images.length" class="grid grid-cols-2 gap-3">
              <article
                v-for="image in form.images"
                :key="image"
                class="overflow-hidden rounded-lg border bg-white"
                :class="image === mainImage ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'"
              >
                <div class="relative">
                  <img :src="image" alt="" class="aspect-[4/3] w-full object-cover">
                  <span
                    v-if="image === mainImage"
                    class="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-1 text-xs font-bold text-white"
                  >
                    Главное
                  </span>
                </div>

                <div class="grid gap-1 bg-slate-50 p-2">
                  <button
                    class="min-h-9 rounded-lg bg-white px-2 text-xs font-bold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="image === mainImage"
                    type="button"
                    @click="makeMainImage(image)"
                  >
                    Сделать главным
                  </button>

                  <button
                    class="min-h-9 rounded-lg bg-white px-2 text-xs font-bold text-rose-700"
                    type="button"
                    @click="removeImage(image)"
                  >
                    Удалить
                  </button>
                </div>
              </article>
            </div>
          </div>
        </AdminField>

        <AdminField label="Фото URL" hint="Дополнительно: каждая ссылка с новой строки.">
          <textarea v-model="imageText" class="focus-ring min-h-24 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400" placeholder="https://..." />
        </AdminField>
      </div>
    </section>

    <p v-if="errorMessage" class="rounded-lg bg-rose-50 p-4 text-sm font-bold text-rose-700">
      {{ errorMessage }}
    </p>

    <button
      class="focus-ring sticky bottom-4 min-h-11 rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm shadow-emerald-600/25 transition disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="isSubmitting"
      type="submit"
    >
      {{ isSubmitting ? 'Сохраняем...' : (props.submitLabel ?? 'Сохранить автомобиль') }}
    </button>
  </form>
</template>
